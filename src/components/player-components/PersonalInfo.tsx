'use client';

import { Input } from '@/components/ui/input';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { EditPlayerFormValues } from '@/schemas/player.schema';

interface PersonalInfoSectionProps {
  register: UseFormRegister<EditPlayerFormValues>;
  errors: FieldErrors<EditPlayerFormValues>;
  isEditing: boolean;
  player: EditPlayerFormValues | null;
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
        Personal &amp; Contact Information
      </h2>
      <div className="rounded-lg border border-gray-200 bg-white p-4 grid grid-cols-2 gap-4">
        {isEditing ? (
          <>
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium">First Name</label>
              <Input
                {...register('baseUser.firstName')}
                className={`w-full p-1 border rounded ${
                  errors?.baseUser?.firstName ? 'border-red-500' : ''
                }`}
              />
              {errors?.baseUser?.firstName && (
                <p className="text-red-500 text-sm">
                  {errors.baseUser.firstName.message as string}
                </p>
              )}
            </div>

            {/* Birth Date */}
            <div>
              <label className="block text-sm font-medium">Birth Date</label>
              <Input
                {...register('playerDetails.birthDate')}
                className={`w-full p-1 border rounded ${
                  errors?.playerDetails?.birthDate ? 'border-red-500' : ''
                }`}
              />
              {errors?.playerDetails?.birthDate && (
                <p className="text-red-500 text-sm">
                  {errors.playerDetails.birthDate.message as string}
                </p>
              )}
            </div>

            {/* Middle Name */}
            <div>
              <label className="block text-sm font-medium">Middle Name</label>
              <Input
                {...register('baseUser.middleName')}
                className="w-full p-1 border rounded"
              />
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium">Gender</label>
              <Input
                {...register('playerDetails.gender')}
                className={`w-full p-1 border rounded ${
                  errors?.playerDetails?.gender ? 'border-red-500' : ''
                }`}
              />
              {errors?.playerDetails?.gender && (
                <p className="text-red-500 text-sm">
                  {errors.playerDetails.gender.message as string}
                </p>
              )}
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <Input
                {...register('baseUser.lastName')}
                className={`w-full p-1 border rounded ${
                  errors?.baseUser?.lastName ? 'border-red-500' : ''
                }`}
              />
              {errors?.baseUser?.lastName && (
                <p className="text-red-500 text-sm">
                  {errors.baseUser.lastName.message as string}
                </p>
              )}
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <Input
                type="email"
                {...register('baseUser.email')}
                className={`w-full p-1 border rounded ${
                  errors?.baseUser?.email ? 'border-red-500' : ''
                }`}
              />
              {errors?.baseUser?.email && (
                <p className="text-red-500 text-sm">
                  {errors.baseUser.email.message as string}
                </p>
              )}
            </div>

            {/* Name Suffix */}
            <div>
              <label className="block text-sm font-medium">Name Suffix</label>
              <Input
                {...register('baseUser.nameSuffix')}
                className="w-full p-1 border rounded"
              />
            </div>

            {/* Age Proof */}
            <div>
              <label className="block text-sm font-medium">Age Proof</label>
              <p>{player?.playerDetails.ageProof}</p>
            </div>
          </>
        ) : (
          <>
            {/* First Name */}
            <div>
              <label className="block text-sm font-medium">First Name</label>
              <p>{player?.baseUser.firstName}</p>
            </div>

            {/* Birth Date */}
            <div>
              <label className="block text-sm font-medium">Birth Date</label>
              <p>{player?.playerDetails.birthDate}</p>
            </div>

            {/* Middle Name */}
            <div>
              <label className="block text-sm font-medium">Middle Name</label>
              <p>{player?.baseUser.middleName}</p>
            </div>

            {/* Gender */}
            <div>
              <label className="block text-sm font-medium">Gender</label>
              <p>{player?.playerDetails.gender}</p>
            </div>

            {/* Last Name */}
            <div>
              <label className="block text-sm font-medium">Last Name</label>
              <p>{player?.baseUser.lastName}</p>
            </div>

            {/* Email */}
            <div>
              <label className="block text-sm font-medium">Email</label>
              <p>{player?.baseUser.email}</p>
            </div>

            {/* Name Suffix */}
            <div>
              <label className="block text-sm font-medium">Name Suffix</label>
              <p>{player?.baseUser.nameSuffix}</p>
            </div>

            {/* Age Proof */}
            <div>
              <label className="block text-sm font-medium">Age Proof</label>
              <p>{player?.playerDetails.ageProof}</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
