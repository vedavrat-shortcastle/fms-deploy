'use client';

import { Input } from '@/components/ui/input';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { EditPlayerFormValues } from '@/schemas/player.schema';

interface StudentDetailsSectionProps {
  register: UseFormRegister<EditPlayerFormValues>;
  errors: FieldErrors<EditPlayerFormValues>;
  isEditing: boolean;
  player: EditPlayerFormValues | null;
}

export default function StudentDetailsSection({
  register,
  errors,
  isEditing,
  player,
}: StudentDetailsSectionProps) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Student Details</h2>
      <div className="rounded-lg border border-gray-200 bg-white p-4 grid grid-cols-2 gap-4">
        {isEditing ? (
          <>
            {/* School Name */}
            <div>
              <label className="block text-sm font-medium">School Name</label>
              <Input
                {...register('playerDetails.schoolName')}
                className={`w-full p-1 border rounded ${
                  errors?.playerDetails?.schoolName ? 'border-red-500' : ''
                }`}
              />
              {errors?.playerDetails?.schoolName && (
                <p className="text-red-500 text-sm">
                  {errors.playerDetails.schoolName.message as string}
                </p>
              )}
            </div>

            {/* Grade in School */}
            <div>
              <label className="block text-sm font-medium">
                Grade in School
              </label>
              <Input
                {...register('playerDetails.gradeInSchool')}
                className={`w-full p-1 border rounded ${
                  errors?.playerDetails?.gradeInSchool ? 'border-red-500' : ''
                }`}
              />
              {errors?.playerDetails?.gradeInSchool && (
                <p className="text-red-500 text-sm">
                  {errors.playerDetails.gradeInSchool.message as string}
                </p>
              )}
            </div>

            {/* Graduation Year */}
            <div>
              <label className="block text-sm font-medium">
                Graduation Year
              </label>
              <Input
                {...register('playerDetails.graduationYear')}
                className={`w-full p-1 border rounded ${
                  errors?.playerDetails?.graduationYear ? 'border-red-500' : ''
                }`}
              />
              {errors?.playerDetails?.graduationYear && (
                <p className="text-red-500 text-sm">
                  {errors.playerDetails.graduationYear.message as string}
                </p>
              )}
            </div>

            {/* Grade as of (Date) */}
            <div>
              <label className="block text-sm font-medium">
                Grade as of (Date)
              </label>
              <Input
                {...register('playerDetails.gradeDate')}
                className={`w-full p-1 border rounded ${
                  errors?.playerDetails?.gradeDate ? 'border-red-500' : ''
                }`}
              />
              {errors?.playerDetails?.gradeDate && (
                <p className="text-red-500 text-sm">
                  {errors.playerDetails.gradeDate.message as string}
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            {/* School Name */}
            <div>
              <label className="block text-sm font-medium">School Name</label>
              <p>{player?.playerDetails.schoolName}</p>
            </div>

            {/* Grade in School */}
            <div>
              <label className="block text-sm font-medium">
                Grade in School
              </label>
              <p>{player?.playerDetails.gradeInSchool}</p>
            </div>

            {/* Graduation Year */}
            <div>
              <label className="block text-sm font-medium">
                Graduation Year
              </label>
              <p>{player?.playerDetails.graduationYear}</p>
            </div>

            {/* Grade as of (Date) */}
            <div>
              <label className="block text-sm font-medium">
                Grade as of (Date)
              </label>
              <p>{player?.playerDetails.gradeDate?.toString()}</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
