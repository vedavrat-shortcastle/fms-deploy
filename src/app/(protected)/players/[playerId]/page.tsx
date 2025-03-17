'use client';

import { ArrowLeft, Loader2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import Sidebar from '@/components/SideBar';
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import PersonalInfoSection from '@/components/player-components/PersonalInfo';
import AddressSection from '@/components/player-components/AddressInfo';
import PlayerDetailsSection from '@/components/player-components/PlayerDetails';
import StudentDetailsSection from '@/components/player-components/StudentDetails';
import ClubInfoSection from '@/components/player-components/ClubInfo';
import {
  EditPlayerFormValues,
  editPlayerSchema,
} from '@/schemas/player.schema';

export default function PlayerDetails() {
  const router = useRouter();
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

  const onSubmit = async (data: EditPlayerFormValues) => {
    setIsSubmitting(true);
    try {
      // Simulate API call delay
      await new Promise((resolve) => setTimeout(resolve, 1000));
      setPlayer(data);
      setIsEditing(false);
    } catch (error) {
      console.error('Error submitting form:', error);
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleEditToggle = () => {
    if (isEditing) {
      // Submit form
      handleSubmit(onSubmit)();
    } else {
      reset({});
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    reset({});
  };
  //delete player
  const handleDelete = async () => {
    setIsSubmitting(true);
    try {
      await new Promise((resolve) => setTimeout(resolve, 1000));
      router.push('/players');
    } catch (error) {
      console.error('Error deleting player:', error);
      setIsSubmitting(false);
      setShowDeleteConfirm(false);
    }
  };

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
                src={player?.playerDetails.avatarUrl}
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
              Are you sure you want to delete {player?.baseUser.firstName}{' '}
              {player?.baseUser.lastName}? This action cannot be undone.
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
