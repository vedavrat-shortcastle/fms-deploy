'use client';

import { Input } from '@/components/ui/input';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { EditPlayerFormValues } from '@/schemas/player.schema';

interface ClubInfoSectionProps {
  register: UseFormRegister<EditPlayerFormValues>;
  errors: FieldErrors<EditPlayerFormValues>;
  isEditing: boolean;
  player: EditPlayerFormValues | null;
}

export default function ClubInfoSection({
  register,

  isEditing,
  player,
}: ClubInfoSectionProps) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Club Information</h2>
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        <label className="block text-sm font-medium">Club Name</label>
        {isEditing ? (
          <Input
            {...register('playerDetails.clubName')}
            className="w-full p-1 border rounded"
          />
        ) : (
          <p>{player?.playerDetails.clubName}</p>
        )}
      </div>
    </section>
  );
}
