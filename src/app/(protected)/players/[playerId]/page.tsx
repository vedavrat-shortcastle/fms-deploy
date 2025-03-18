'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft, Loader2 } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Sidebar from '@/components/SideBar';
import PersonalInfoSection from '@/components/player-components/PersonalInfo';
import AddressSection from '@/components/player-components/AddressInfo';
import PlayerDetailsSection from '@/components/player-components/PlayerDetails';
import StudentDetailsSection from '@/components/player-components/StudentDetails';
import ClubInfoSection from '@/components/player-components/ClubInfo';
import {
  EditPlayerFormValues,
  editPlayerSchema,
} from '@/schemas/player.schema';
import { trpc } from '@/utils/trpc'; // Import your tRPC hook

export default function PlayerDetails() {
  const router = useRouter();
  const { playerId } = useParams<{ playerId: string }>();
  console.log('Player ID:', playerId);
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

  // Use the tRPC query hook to fetch the player details
  const { data, error, isLoading } = trpc.player.getPlayerById.useQuery(
    { id: playerId },
    { enabled: !!playerId }
  );

  // Debug log the fetched data and errors
  useEffect(() => {
    if (data) {
      console.debug('Player data fetched:', data);
      // Map the data into our local state shape
      setPlayer({
        baseUser: {
          id: data.id,
          email: data.email,
          firstName: data.firstName,
          lastName: data.lastName,
        },
        playerDetails: {
          // Map other player details from data as needed
          // For example: avatarUrl: data.playerDetails?.avatarUrl,
        },
        // Map additional sections if necessary
      });
    }
    if (error) {
      console.error('Error fetching player details:', error);
    }
  }, [data, error]);

  const onSubmit = async (formData: EditPlayerFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      console.debug('Form submitted with data:', formData);
      setPlayer(formData);
      setIsEditing(false);
    } catch (submitError) {
      console.error('Error submitting form:', submitError);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Submit form
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

  // Delete player
  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      console.debug('Deleting player with id:', playerId);
      // Simulate deletion delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/players');
    } catch (deleteError) {
      console.error('Error deleting player:', deleteError);
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

  if (isLoading || !player) {
    return (
      <div className="flex h-screen justify-center items-center">
        <Loader2 className="h-6 w-6 animate-spin" />
        <span className="ml-2">Loading player details...</span>
      </div>
    );
  }

  return (
    <div className="flex h-screen bg-[#f6f6f6]">
      <Sidebar />
      <div className="flex-1 overflow-auto p-8">
        <Button
          variant="ghost"
          className="mb-6 gap-2"
          onClick={() => router.push('/players')}
          disabled={isSubmitting}
        >
          <ArrowLeft className="h-4 w-4" /> Player
        </Button>
        <div className="flex items-start gap-8">
          <div className="text-center">
            <Avatar className="h-40 w-40 rounded-none">
              <AvatarImage
                src={player.playerDetails?.avatarUrl}
                alt="Profile"
                className="object-cover"
                onError={(e) => (e.currentTarget.src = '/default-avatar.png')}
              />
              <AvatarFallback>SP</AvatarFallback>
            </Avatar>
            {isEditing ? (
              <div className="mt-4 space-y-2">
                <Button
                  variant="outline"
                  className="w-full"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
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
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
              </div>
            ) : (
              <Button
                variant="outline"
                className="mt-4 w-full"
                onClick={handleEditToggle}
                disabled={isSubmitting}
              >
                Edit details
              </Button>
            )}
            <Button
              variant="ghost"
              className="mt-2 w-full text-[#f00000]"
              onClick={() => setShowDeleteConfirm(true)}
              disabled={isSubmitting || isEditing}
            >
              Delete Player
            </Button>
          </div>
          <div className="flex-1">
            <form onSubmit={handleSubmit(onSubmit)}>
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
            </form>
          </div>
        </div>
      </div>

      {/* Delete Confirmation Dialog */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full">
            <h3 className="text-xl font-semibold mb-4">Confirm Deletion</h3>
            <p className="mb-6">
              Are you sure you want to delete {player.baseUser?.firstName}{' '}
              {player.baseUser?.lastName}? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <Button
                variant="outline"
                onClick={() => setShowDeleteConfirm(false)}
                disabled={isSubmitting}
              >
                Cancel
              </Button>
              <Button
                variant="destructive"
                onClick={handleDelete}
                disabled={isSubmitting}
              >
                {isSubmitting ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Deleting...
                  </>
                ) : (
                  'Delete Player'
                )}
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
