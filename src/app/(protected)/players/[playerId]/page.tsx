'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { useSession } from 'next-auth/react';
import {
  type EditPlayerFormValues,
  editPlayerSchema,
} from '@/schemas/Player.schema';
import { trpc } from '@/utils/trpc';
import Loader from '@/components/Loader';
import { useToast } from '@/hooks/useToast';
import { DeleteConfirmDialog } from '@/components/deleteConfirmDialog';
import PlayerProfilePicture from '@/components/player-components/PlayerProfilePicture';
import PlayerDetailsForm from '@/components/player-components/PlayerDetailsForm';

export default function PlayerDetails() {
  const router = useRouter();
  const { data: sessionData } = useSession();
  const { toast } = useToast();
  const { playerId } = useParams<{ playerId: string }>();

  if (!playerId) {
    console.error('No player id found in the route!');
  }

  const [player, setPlayer] = useState<EditPlayerFormValues | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<EditPlayerFormValues>({
    resolver: zodResolver(editPlayerSchema),
  });

  // Check if the logged-in user is a parent
  const isParent = (sessionData?.user?.role as string) === 'PARENT';

  // Conditional Query based on user role
  const { data, error, isLoading, refetch } = isParent
    ? trpc.parent.getPlayerById.useQuery(
        { id: playerId },
        { enabled: !!playerId }
      )
    : trpc.player.getPlayerById.useQuery(
        { id: playerId },
        { enabled: !!playerId }
      );

  // Conditional Edit Mutation based on user role
  const editPlayerMutation = isParent
    ? trpc.parent.editPlayerById.useMutation({
        onSuccess: () => handleEditSuccess(),
        onError: (error) => handleEditError(error),
      })
    : trpc.player.editPlayerById.useMutation({
        onSuccess: () => handleEditSuccess(),
        onError: (error) => handleEditError(error),
      });

  // Conditional Delete Mutation based on user role
  const deletePlayerMutation = isParent
    ? trpc.parent.deletePlayerById.useMutation({
        onSuccess: () => router.push('/players'),
        onError: (error) => handleDeleteError(error),
      })
    : trpc.player.deletePlayerById.useMutation({
        onSuccess: () => router.push('/players'),
        onError: (error) => handleDeleteError(error),
      });

  useEffect(() => {
    if (data) {
      const mappedPlayer = mapPlayerData(data);
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

  const mapPlayerData = (data: any): EditPlayerFormValues => {
    return {
      baseUser: {
        id: data.id,
        email: data.email || '',
        firstName: data.firstName || '',
        lastName: data.lastName || '',
        middleName: data.middleName || '',
        nameSuffix: data.nameSuffix || '',
      },
      playerDetails: {
        gender: data.gender,
        birthDate:
          data.birthDate instanceof Date
            ? data.birthDate
            : new Date(data.birthDate),
        avatarUrl: data.avatarUrl || undefined,
        ageProof: data.ageProof || undefined,
        streetAddress: data.streetAddress || '',
        streetAddress2: data.streetAddress2 || undefined,
        country: data.country || '',
        state: data.state || '',
        city: data.city || '',
        postalCode: data.postalCode || '',
        phoneNumber: data.phoneNumber || undefined,
        countryCode: data.countryCode || undefined,
        fideId: data.fideId || undefined,
        schoolName: data.schoolName || undefined,
        graduationYear: data.graduationYear || undefined,
        gradeInSchool: data.gradeInSchool || undefined,
        gradeDate: data.gradeDate
          ? typeof data.gradeDate === 'string'
            ? new Date(data.gradeDate)
            : data.gradeDate
          : undefined,
        clubName: data.clubName || undefined,
      },
    };
  };

  const handleEditSuccess = () => {
    setIsEditing(false);
    refetch();
    setIsSubmitting(false);
    toast({
      title: 'Success',
      description: 'Player details updated successfully!',
      variant: 'default',
    });
  };

  const handleEditError = (error: any) => {
    console.error('Failed to update player:', error.message);
    setIsSubmitting(false);
    toast({
      title: 'Error',
      description: `Failed to update player: ${error.message}`,
      variant: 'destructive',
    });
  };

  const handleDeleteError = (error: any) => {
    console.error('Failed to delete player:', error.message);
    setIsSubmitting(false);
    setShowDeleteConfirm(false);
  };

  const onSubmit = (formData: EditPlayerFormValues) => {
    setIsSubmitting(true);
    const updatedFormData = prepareFormDataForSubmission(formData);
    editPlayerMutation.mutate(updatedFormData);
  };

  const prepareFormDataForSubmission = (
    formData: EditPlayerFormValues
  ): EditPlayerFormValues => {
    return {
      ...formData,
      baseUser: {
        ...formData.baseUser,
        id: playerId,
        email: formData.baseUser.email || '',
        firstName: formData.baseUser.firstName || '',
        lastName: formData.baseUser.lastName || '',
      },
      playerDetails: {
        ...formData.playerDetails,
        birthDate:
          formData.playerDetails.birthDate instanceof Date
            ? formData.playerDetails.birthDate
            : new Date(formData.playerDetails.birthDate),
        streetAddress: formData.playerDetails.streetAddress || '',
        country: formData.playerDetails.country || '',
        state: formData.playerDetails.state || '',
        city: formData.playerDetails.city || '',
        postalCode: formData.playerDetails.postalCode || '',
      },
    };
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleSubmit(onSubmit)();
    } else {
      console.debug('Entering edit mode');
      if (player) reset(player);
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    console.debug('Cancelling edit mode');
    setIsEditing(false);
    if (player) reset(player);
  };

  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      console.debug('Deleting player with id:', playerId);
      deletePlayerMutation.mutate({ id: playerId });
    } catch (deleteError) {
      console.error('Error deleting player:', deleteError);
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
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
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-4 w-4" /> Player
        </Button>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <PlayerProfilePicture
            player={player}
            isEditing={isEditing}
            isSubmitting={isSubmitting}
            handleEditToggle={handleEditToggle}
            handleCancel={handleCancel}
            setShowDeleteConfirm={setShowDeleteConfirm}
            refetch={refetch}
          />

          <div className="md:col-span-2">
            <PlayerDetailsForm
              player={player}
              isEditing={isEditing}
              register={register}
              errors={errors}
              handleSubmit={handleSubmit}
              onSubmit={onSubmit}
            />
          </div>
        </div>
      </div>

      <DeleteConfirmDialog
        open={showDeleteConfirm}
        onOpenChange={setShowDeleteConfirm}
        onConfirm={handleDelete}
        isSubmitting={isSubmitting}
        playerName={`${player.baseUser.firstName} ${player.baseUser.lastName}`}
      />
    </div>
  );
}
