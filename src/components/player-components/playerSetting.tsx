'use client';

import type React from 'react';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Loader2, Pencil, Lock } from 'lucide-react';
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
import { ChangePasswordDialog } from '@/components/changePassword';
import { DeleteConfirmDialog } from '@/components/deleteConfirmDialog';

type ChangePasswordFormValues = {
  oldPassword: string;
  newPassword: string;
  confirmNewPassword: string;
};

export default function PlayerSettings() {
  const session = useSession();
  const router = useRouter();
  const playerId = session.data?.user.id;
  const { toast } = useToast();

  const [player, setPlayer] = useState<EditPlayerFormValues | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [changePasswordModalOpen, setChangePasswordModalOpen] = useState(false);
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
    defaultValues: player || undefined,
  });

  // Use the tRPC query hook to fetch the player details
  const { data, error, isLoading, refetch } =
    trpc.player.getPlayerById.useQuery(
      { id: playerId! },
      { enabled: !!playerId }
    );

  // Mutations
  const deletePlayerMutation = trpc.player.deletePlayerById.useMutation({
    onSuccess: () => {
      router.push('/players');
    },
    onError: (error) => {
      console.error('Failed to delete player:', error.message);
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    },
  });

  const editPlayerMutation = trpc.player.editPlayerById.useMutation({
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

  const changePassword = trpc.authRouter.updatePassword.useMutation({
    onSuccess: () => {
      setChangePasswordModalOpen(false);
      setIsChangingPassword(false);
      toast({
        title: 'Success',
        description: 'Password changed successfully!',
        variant: 'default',
      });
    },
    onError: (error) => {
      console.error('Failed to change password:', error.message);
      setIsChangingPassword(false);
      toast({
        title: 'Error',
        description: `Failed to change password: ${error.message}`,
        variant: 'destructive',
      });
    },
  });

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
            data.birthDate instanceof Date ? data.birthDate : data.birthDate,
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
    if (!playerId) {
      toast({
        title: 'Error',
        description: 'Player ID is missing.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }
    const updatedFormData = {
      ...formData,
      baseUser: {
        ...formData.baseUser,
        id: playerId,
      },
    };
    editPlayerMutation.mutate(updatedFormData);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleSubmit(onSubmit)();
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset(player || {});
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    deletePlayerMutation.mutate({ id: playerId! });
  };

  const handleOpenChangePasswordModal = () => {
    setChangePasswordModalOpen(true);
  };

  const onChangePasswordSubmit = (data: ChangePasswordFormValues) => {
    setIsChangingPassword(true);
    changePassword.mutate(data);
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
        id: playerId!,
        email: player?.baseUser?.email || '',
        firstName: player?.baseUser.firstName || '',
        lastName: player?.baseUser.lastName || '',
      },
      playerDetails: {
        ...player?.playerDetails,
        avatarUrl: profilePictureFile.name,
        birthDate:
          player?.playerDetails.birthDate instanceof Date
            ? player?.playerDetails.birthDate
            : new Date(player?.playerDetails?.birthDate || Date.now()),
        gender: player?.playerDetails?.gender || 'OTHER',
        streetAddress: player?.playerDetails.streetAddress || '',
        country: player?.playerDetails.country || '',
        state: player?.playerDetails.state || '',
        city: player?.playerDetails.city || '',
        postalCode: player?.playerDetails.postalCode || '',
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
          disabled={
            isSubmitting || isUploadingProfilePicture || isChangingPassword
          }
        >
          <ArrowLeft className="h-4 w-4" /> Players
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-1 flex flex-col items-center gap-4">
            <div className="relative">
              <Avatar className="h-40 w-40 rounded-full">
                <AvatarImage
                  src={player.playerDetails?.avatarUrl || ''}
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
                  disabled={
                    isSubmitting ||
                    isUploadingProfilePicture ||
                    isChangingPassword
                  }
                >
                  <Pencil className="mr-2 h-4 w-4" /> Edit details
                </Button>
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleOpenChangePasswordModal}
                  disabled={
                    isSubmitting ||
                    isUploadingProfilePicture ||
                    isChangingPassword
                  }
                >
                  <Lock className="mr-2 h-4 w-4" /> Change Password
                </Button>
                <Button
                  variant="destructive"
                  className="w-full"
                  onClick={() => setShowDeleteConfirm(true)}
                  disabled={
                    isSubmitting ||
                    isEditing ||
                    isUploadingProfilePicture ||
                    isChangingPassword
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
                  disabled={
                    isSubmitting ||
                    isUploadingProfilePicture ||
                    isChangingPassword
                  }
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
                  disabled={
                    isSubmitting ||
                    isUploadingProfilePicture ||
                    isChangingPassword
                  }
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

      {/* Change Password Dialog */}
      <ChangePasswordDialog
        open={changePasswordModalOpen}
        onOpenChange={setChangePasswordModalOpen}
        onSubmit={onChangePasswordSubmit}
        isChangingPassword={isChangingPassword}
      />
    </div>
  );
}
