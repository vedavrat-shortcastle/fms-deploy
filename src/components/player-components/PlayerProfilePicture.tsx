'use client';

import { useState } from 'react';
import { Loader2, Pencil } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { type EditPlayerFormValues } from '@/schemas/Player.schema';
import { trpc } from '@/utils/trpc';
import { useToast } from '@/hooks/useToast';
import { Input } from '@/components/ui/input';

interface PlayerProfilePictureProps {
  player: EditPlayerFormValues;
  isEditing: boolean;
  isSubmitting: boolean;
  handleEditToggle: () => void;
  handleCancel: () => void;
  setShowDeleteConfirm: (show: boolean) => void;
  refetch: () => void;
}

export default function PlayerProfilePicture({
  player,
  isEditing,
  isSubmitting,
  handleEditToggle,
  handleCancel,
  setShowDeleteConfirm,
  refetch,
}: PlayerProfilePictureProps) {
  const [profilePictureFile, setProfilePictureFile] = useState<File | null>(
    null
  );
  const [isUploadingProfilePicture, setIsUploadingProfilePicture] =
    useState(false);
  const { toast } = useToast();

  const updateProfilePictureMutation = trpc.player.editPlayerById.useMutation({
    onSuccess: () => {
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

  const handleProfilePictureChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    if (event.target.files && event.target.files.length > 0) {
      setProfilePictureFile(event.target.files[0]);
    }
  };

  const handleUpdateProfilePicture = async () => {
    if (!profilePictureFile || !player) {
      toast({
        title: 'Error',
        description: 'Please select a profile picture or player not loaded.',
        variant: 'destructive',
      });
      return;
    }

    setIsUploadingProfilePicture(true);

    const updateData: EditPlayerFormValues = {
      baseUser: {
        ...player.baseUser,
        id: player.baseUser.id,
        email: player.baseUser.email || '',
        firstName: player.baseUser.firstName || '',
        lastName: player.baseUser.lastName || '',
      },
      playerDetails: {
        ...player.playerDetails,
        avatarUrl: profilePictureFile.name,
        birthDate:
          player.playerDetails.birthDate instanceof Date
            ? player.playerDetails.birthDate
            : new Date(player.playerDetails.birthDate),
        gender: player.playerDetails.gender,
        streetAddress: player.playerDetails.streetAddress || '',
        country: player.playerDetails.country || '',
        state: player.playerDetails.state || '',
        city: player.playerDetails.city || '',
        postalCode: player.playerDetails.postalCode || '',
      },
    };

    updateProfilePictureMutation.mutate(updateData);
  };

  return (
    <div className="md:col-span-1 flex flex-col items-center gap-4">
      <div className="relative">
        <Avatar className="h-40 w-40 rounded-full">
          <AvatarImage
            src={player.playerDetails.avatarUrl || ''}
            alt="Profile"
            className="object-cover"
            onError={(e) => (e.currentTarget.src = '/default-avatar.png')}
          />
          <AvatarFallback>
            {player.baseUser.firstName?.[0]}
            {player.baseUser.lastName?.[0]}
          </AvatarFallback>
        </Avatar>
        {isEditing && (
          <label
            htmlFor="profile-picture-upload"
            className="absolute bottom-0 right-0 bg-primary rounded-full p-2 cursor-pointer shadow-md"
          >
            <Pencil className="h-4 w-4 text-white" />
            <Input
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
            disabled={isSubmitting || isEditing || isUploadingProfilePicture}
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
            onClick={handleEditToggle}
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
  );
}
