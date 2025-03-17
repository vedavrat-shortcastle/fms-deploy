import { Input } from '@/components/ui/input';
import { Player } from '@/types/player';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { PlayerFormData } from '@/schemas/Player.schema';

interface ClubInfoSectionProps {
  register: UseFormRegister<PlayerFormData>;
  errors: FieldErrors<PlayerFormData>;
  isEditing: boolean;
  player: Player;
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
            {...register('clubInfo.clubName')}
            className="w-full p-1 border rounded"
          />
        ) : (
          <p>{player.clubInfo.clubName}</p>
        )}
      </div>
    </section>
  );
}
