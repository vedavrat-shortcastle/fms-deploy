'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Pencil } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import PersonalInfoSection from '@/components/player-components/PersonalInfo';
import AddressSection from '@/components/player-components/AddressInfo';
import PlayerDetailsSection from '@/components/player-components/PlayerDetails';
import StudentDetailsSection from '@/components/player-components/StudentDetails';
import ClubInfoSection from '@/components/player-components/ClubInfo';
import {
  type EditPlayerFormValues,
  editPlayerSchema,
} from '@/schemas/Player.schema';
import { trpc } from '@/utils/trpc';
import Loader from '@/components/Loader';
import { useSession } from 'next-auth/react';

import { useToast } from '@/hooks/useToast';
import { DeleteConfirmDialog } from '@/components/deleteConfirmDialog';

export default function PlayerDetails() {
  const router = useRouter();
  const { data: sessionData } = useSession();
  console.log('this is session', sessionData?.user);

  const { playerId } = useParams<{ playerId: string }>();
  if (!playerId) {
    console.error('No player id found in the route!');
  }

  const [player, setPlayer] = useState<EditPlayerFormValues | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
  );
  const [isUploadingProfilePicture, setIsUploadingProfilePicture] =
    useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditPlayerFormValues>({
    resolver: zodResolver(editPlayerSchema),
  });

  // Check if the logged-in user is a parent.
  const isParent = (sessionData?.user?.role as string) === 'PARENT';

  // Conditional Query based on user role.
  const { data, error, isLoading, refetch } = isParent
    ? trpc.parent.getPlayerById.useQuery(
        { id: playerId },
        { enabled: !!playerId }
      )
    : trpc.player.getPlayerById.useQuery(
        { id: playerId },
        { enabled: !!playerId }
      );

  const { toast } = useToast();

  // Conditional Edit Mutation based on user role.
  const editPlayerMutation = isParent
    ? trpc.parent.editPlayerById.useMutation({
        onSuccess: () => {
          setIsEditing(false);
          refetch();
          toast({
            title: 'Success',
            description: 'Player details updated successfully!',
            variant: 'default',
          });
        },
        onError: (error) => {
          console.error('Failed to update player:', error.message);
          setIsSubmitting(false);
          toast({
            title: 'Error',
            description: `Failed to update player: ${error.message}`,
            variant: 'destructive',
          });
        },
      })
    : trpc.player.editPlayerById.useMutation({
        onSuccess: () => {
          setIsEditing(false);
          refetch();
          toast({
            title: 'Success',
            description: 'Player details updated successfully!',
            variant: 'default',
          });
        },
        onError: (error) => {
          console.error('Failed to update player:', error.message);
          setIsSubmitting(false);
          toast({
            title: 'Error',
            description: `Failed to update player: ${error.message}`,
            variant: 'destructive',
          });
        },
      });

  // Conditional Delete Mutation based on user role.
  const deletePlayerMutation = isParent
    ? trpc.parent.deletePlayerById.useMutation({
        onSuccess: () => {
          router.push('/players');
        },
        onError: (error) => {
          console.error('Failed to delete player:', error.message);
          setIsSubmitting(false);
          setShowDeleteConfirm(false);
        },
      })
    : trpc.player.deletePlayerById.useMutation({
        onSuccess: () => {
          router.push('/players');
        },
        onError: (error) => {
          console.error('Failed to delete player:', error.message);
          setIsSubmitting(false);
          setShowDeleteConfirm(false);
        },
      });

  // Mutation for updating the profile picture remains the same (using player mutation).
  const updateProfilePictureMutation = trpc.player.editPlayerById.useMutation({
    onSuccess: (data) => {
      setPlayer((prevPlayer) =>
        prevPlayer
          ? {
              ...prevPlayer,
              playerDetails: {
                ...prevPlayer.playerDetails,
                avatarUrl: data?.playerDetails.avatarUrl || undefined,
              },
            }
          : null
      );
      refetch();
      setIsUploadingProfilePicture(false);
      setProfilePictureFile(null);
      toast({
        title: 'Success',
        description: 'Profile picture updated successfully!',
        variant: 'default',
      });
    },
    onError: (error) => {
      console.error('Failed to update profile picture:', error.message);
      setIsUploadingProfilePicture(false);
      toast({
        title: 'Error',
        description: `Failed to update profile picture: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

  useEffect(() => {
    if (data) {
      console.debug('Player data fetched:', data);
      // Map the fetched data into the structure expected by the form.
      const mappedPlayer: EditPlayerFormValues = {
        baseUser: {
          id: data.id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
          middleName: (data as any).middleName || '',
          nameSuffix: (data as any).nameSuffix || '',
        },
        playerDetails: {
          gender: data.gender,
          birthDate:
            data.birthDate instanceof Date
              ? data.birthDate.toISOString()
              : data.birthDate,
          avatarUrl: data.avatarUrl || undefined,
          ageProof: data.ageProof || undefined,
          streetAddress: data.streetAddress,
          streetAddress2: data.streetAddress2 || undefined,
          country: data.country,
          state: data.state,
          city: data.city,
          postalCode: data.postalCode,
          phoneNumber: data.phoneNumber || undefined,
          countryCode: data.countryCode || undefined,
          fideId: data.fideId || undefined,
          schoolName: data.schoolName || undefined,
          graduationYear: data.graduationYear || undefined,
          gradeInSchool: data.gradeInSchool || undefined,
          gradeDate:
            data.gradeDate && typeof data.gradeDate === 'string'
              ? new Date(data.gradeDate)
              : data.gradeDate || undefined,
          clubName: data.clubName || undefined,
        },
      };
      setPlayer(mappedPlayer);
      reset(mappedPlayer);
    }
    if (error) {
      console.error('Error fetching player details:', error);
      toast({
        title: 'Error',
        description: `Error fetching player details: ${error.message}`,
        variant: 'destructive',
      });
    }
  }, [data, error, reset, toast]);

  const onSubmit = (formData: EditPlayerFormValues) => {
    setIsSubmitting(true);

    // Ensure the baseUser object has the correct id.
    const updatedFormData = {
      ...formData,
      id: playerId,
      baseUser: {
        ...player?.baseUser,
        id: playerId,
      },
    };

    editPlayerMutation.mutate(updatedFormData, {
      onSuccess: () => {
        setPlayer(updatedFormData);
        setIsSubmitting(false);
        toast({
          title: 'Success',
          description: 'Player details updated successfully!',
          variant: 'default',
        });
      },
      onError: (error) => {
        console.error('Error submitting form:', error);
        setIsSubmitting(false);
        toast({
          title: 'Error',
          description: `Failed to update player: ${error.message}`,
          variant: 'destructive',
        });
      },
    });
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleSubmit(onSubmit)();
    } else {
      console.debug('Entering edit mode');
      reset({});
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    console.debug('Cancelling edit mode');
    setIsEditing(false);
    reset({});
  };

  // Delete player based on the proper mutation.
  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      console.debug('Deleting player with id:', playerId);
      deletePlayerMutation.mutate({ id: playerId });
      // Simulate deletion delay.
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/players');
    } catch (deleteError) {
      console.error('Error deleting player:', deleteError);
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  const handleProfilePictureChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setProfilePictureFile(event.target.files[0]);
    }
  };

  const handleUpdateProfilePicture = async () => {
    if (!profilePictureFile) {
      toast({
        title: 'Error',
        description: 'Please select a profile picture.',
        variant: 'destructive',
      });
      return;
    }
    setIsUploadingProfilePicture(true);
    updateProfilePictureMutation.mutate({
      baseUser: {
        ...player?.baseUser,
        id: playerId,
      },
      playerDetails: {
        ...player?.playerDetails,
        avatarUrl: profilePictureFile.name,
      },
    });
  };

  if (isLoading || !player) {
    return (
      <div className="flex h-screen justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f6f6f6]">
      <div className="flex-1 overflow-auto p-8">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => router.push('/players')}
          disabled={isSubmitting || isUploadingProfilePicture}
        >
          <ArrowLeft className="h-4 w-4" /> Player
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-40 w-40 rounded-full">
                <AvatarImage
                  src={player.playerDetails?.avatarUrl}
                  alt="Profile"
                  className="object-cover"
                  onError={(e) => (e.currentTarget.src = '/default-avatar.png')}
                />
                <AvatarFallback>
                  {player.baseUser?.firstName?.[0]}
                  {player.baseUser?.lastName?.[0]}
                </AvatarFallback>
              </Avatar>
              {isEditing && (
                <label
                  htmlFor="profile-picture-upload"
                  className="absolute bottom-0 right-0 bg-primary rounded-full p-2 cursor-pointer shadow-md"
                >
                  <Pencil className="h-4 w-4 text-white" />
                  <input
                    id="profile-picture-upload"
                    type="file"
                    className="hidden"
                    accept="image/*"
                    onChange={handleProfilePictureChange}
                  />
                </label>
              )}
            </div>
            {profilePictureFile && (
              <Button
                variant="secondary"
                onClick={handleUpdateProfilePicture}
                disabled={isUploadingProfilePicture}
                className="w-full"
              >
                {isUploadingProfilePicture ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Uploading...
                  </>
                ) : (
                  'Update Picture'
                )}
              </Button>
            )}
            {!isEditing && (
              <div className="space-y-2 w-full">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleEditToggle}
                  disabled={isSubmitting || isUploadingProfilePicture}
                >
                  <Pencil className="mr-2 h-4 w-4" /> Edit details
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={
                    isSubmitting || isEditing || isUploadingProfilePicture
                  }
                >
                  Delete Player
                </Button>
              </div>
            )}
            {isEditing && (
              <div className="mt-4 space-y-2 w-full">
                <Button
                  variant="default"
                  className="w-full"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting || isUploadingProfilePicture}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Saving...
                    </>
                  ) : (
                    'Save changes'
                  )}
                </Button>
                <Button
                  variant="ghost"
                  className="w-full"
                  onClick={handleCancel}
                  disabled={isSubmitting || isUploadingProfilePicture}
                >
                  Cancel
                </Button>
              </div>
            )}
          </div>
          <div className="md:col-span-2">
            <form
              onSubmit={handleSubmit(onSubmit)}
              className="grid grid-cols-1 gap-6"
            >
              <PersonalInfoSection
                register={register}
                errors={errors}
                isEditing={isEditing}
                player={player}
              />
              <AddressSection
                register={register}
                errors={errors}
                isEditing={isEditing}
                player={player}
              />
              <PlayerDetailsSection
                register={register}
                errors={errors}
                isEditing={isEditing}
                player={player}
              />
              <StudentDetailsSection
                register={register}
                errors={errors}
                isEditing={isEditing}
                player={player}
              />
              <ClubInfoSection
                register={register}
                errors={errors}
                isEditing={isEditing}
                player={player}
              />
              {isEditing && (
                <div className="pt-6">
                  {/* Buttons are now in the sidebar */}
                </div>
              )}
            </form>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      <DeleteConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleDelete}
        isSubmitting={isSubmitting}
        playerName={`${player.baseUser?.firstName} ${player.baseUser?.lastName}`}
      />
    </div>
  );
}
