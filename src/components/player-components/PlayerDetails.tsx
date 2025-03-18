'use client';

import { Input } from '@/components/ui/input';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { EditPlayerFormValues } from '@/schemas/Player.schema';

interface PlayerDetailsSectionProps {
  register: UseFormRegister<EditPlayerFormValues>;
  errors: FieldErrors<EditPlayerFormValues>;
  isEditing: boolean;
  player: EditPlayerFormValues | null;
}

export default function PlayerDetailsSection({
  register,
  errors,
  isEditing,
  player,
}: PlayerDetailsSectionProps) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Player Details</h2>
      <div className="rounded-lg border border-gray-200 bg-white p-4">
        {isEditing ? (
          <>
            <label className="block text-sm font-medium">FIDE ID</label>
            <Input
              {...register('playerDetails.fideId')}
              className={`w-full p-1 border rounded ${
                errors?.playerDetails?.fideId ? 'border-red-500' : ''
              }`}
            />
            {errors?.playerDetails?.fideId && (
              <p className="text-red-500 text-sm">
                {errors.playerDetails.fideId.message as string}
              </p>
            )}
          </>
        ) : (
          <>
            <label className="block text-sm font-medium">FIDE ID</label>
            <p>{player?.playerDetails.fideId}</p>
          </>
        )}
      </div>
    </section>
  );
}
