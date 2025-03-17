import { Input } from '@/components/ui/input';
import { Player } from '@/types/player';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { PlayerFormData } from '@/schemas/Player.schema';

interface PersonalInfoSectionProps {
  register: UseFormRegister<PlayerFormData>;
  errors: FieldErrors<PlayerFormData>;
  isEditing: boolean;
  player: Player;
}

export default function PersonalInfoSection({
  register,
  errors,
  isEditing,
  player,
}: PersonalInfoSectionProps) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">
        Personal & Contact Information
      </h2>
      <div className="rounded-lg border border-gray-200 bg-white p-4 grid grid-cols-2 gap-4">
        {isEditing ? (
          <>
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium">First Name</label>
              <Input
                {...register('firstName')}
                className={`w-full p-1 border rounded ${
                  errors.firstName ? 'border-red-500' : ''
                }`}
              />
              {errors.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.firstName.message}
                </p>
              )}
            </div>

            {/* Birth Date */}
            <div>
              <label className="block text-sm font-medium">Birth Date</label>
              <Input
                {...register('birthDate')}
                className={`w-full p-1 border rounded ${
                  errors.birthDate ? 'border-red-500' : ''
                }`}
              />
              {errors.birthDate && (
                <p className="text-red-500 text-sm">
                  {errors.birthDate.message}
                </p>
              )}
            </div>

            {/* Middle Name */}
            <div>
              <label className="block text-sm font-medium">Middle Name</label>
              <Input
                {...register('middleName')}
                className="w-full p-1 border rounded"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium">Gender</label>
              <Input
                {...register('gender')}
                className={`w-full p-1 border rounded ${
                  errors.gender ? 'border-red-500' : ''
                }`}
              />
              {errors.gender && (
                <p className="text-red-500 text-sm">{errors.gender.message}</p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <Input
                {...register('lastName')}
                className={`w-full p-1 border rounded ${
                  errors.lastName ? 'border-red-500' : ''
                }`}
              />
              {errors.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.lastName.message}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <Input
                type="email"
                {...register('email')}
                className={`w-full p-1 border rounded ${
                  errors.email ? 'border-red-500' : ''
                }`}
              />
              {errors.email && (
                <p className="text-red-500 text-sm">{errors.email.message}</p>
              )}
            </div>

            {/* Name Suffix */}
            <div>
              <label className="block text-sm font-medium">Name Suffix</label>
              <Input
                {...register('nameSuffix')}
                className="w-full p-1 border rounded"
              />
            </div>

            {/* Age Proof */}
            <div>
              <label className="block text-sm font-medium">Age Proof</label>
              <p>{player.ageProof}</p>
            </div>
          </>
        ) : (
          <>
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium">First Name</label>
              <p>{player.firstName}</p>
            </div>

            {/* Birth Date */}
            <div>
              <label className="block text-sm font-medium">Birth Date</label>
              <p>{player.birthDate}</p>
            </div>

            {/* Middle Name */}
            <div>
              <label className="block text-sm font-medium">Middle Name</label>
              <p>{player.middleName}</p>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium">Gender</label>
              <p>{player.gender}</p>
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <p>{player.lastName}</p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <p>{player.email}</p>
            </div>

            {/* Name Suffix */}
            <div>
              <label className="block text-sm font-medium">Name Suffix</label>
              <p>{player.nameSuffix}</p>
            </div>

            {/* Age Proof */}
            <div>
              <label className="block text-sm font-medium">Age Proof</label>
              <p>{player.ageProof}</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
