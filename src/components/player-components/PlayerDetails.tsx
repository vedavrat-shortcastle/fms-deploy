import { Input } from '@/components/ui/input';
import { Player } from '@/types/player';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { PlayerFormData } from '@/schemas/player.schema';

interface PlayerDetailsSectionProps {
  register: UseFormRegister<PlayerFormData>;
  errors: FieldErrors<PlayerFormData>;
  isEditing: boolean;
  player: Player;
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
        <label className="block text-sm font-medium">FIDE ID</label>
        {isEditing ? (
          <>
            <Input
              {...register('playerDetails.fideId')}
              className={`w-full p-1 border rounded ${
                errors.playerDetails?.fideId ? 'border-red-500' : ''
              }`}
            />
            {errors.playerDetails?.fideId && (
              <p className="text-red-500 text-sm">
                {errors.playerDetails.fideId.message}
              </p>
            )}
          </>
        ) : (
          <p>{player.playerDetails.fideId}</p>
        )}
      </div>
    </section>
  );
}
