import { Input } from '@/components/ui/input';
import { Player } from '@/types/player';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { PlayerFormData } from '@/schemas/player.schema';

interface StudentDetailsSectionProps {
  register: UseFormRegister<PlayerFormData>;
  errors: FieldErrors<PlayerFormData>;
  isEditing: boolean;
  player: Player;
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
        {/* School Name */}
        <div>
          <label className="block text-sm font-medium">School Name</label>
          {isEditing ? (
            <>
              <Input
                {...register('studentDetails.schoolName')}
                className={`w-full p-1 border rounded ${
                  errors.studentDetails?.schoolName ? 'border-red-500' : ''
                }`}
              />
              {errors.studentDetails?.schoolName && (
                <p className="text-red-500 text-sm">
                  {errors.studentDetails.schoolName.message}
                </p>
              )}
            </>
          ) : (
            <p>{player.studentDetails.schoolName}</p>
          )}
        </div>

        {/* Grade */}
        <div>
          <label className="block text-sm font-medium">Grade in School</label>
          {isEditing ? (
            <>
              <Input
                {...register('studentDetails.grade')}
                className={`w-full p-1 border rounded ${
                  errors.studentDetails?.grade ? 'border-red-500' : ''
                }`}
              />
              {errors.studentDetails?.grade && (
                <p className="text-red-500 text-sm">
                  {errors.studentDetails.grade.message}
                </p>
              )}
            </>
          ) : (
            <p>{player.studentDetails.grade}</p>
          )}
        </div>

        {/* Graduation Year */}
        <div>
          <label className="block text-sm font-medium">Graduation Year</label>
          {isEditing ? (
            <>
              <Input
                {...register('studentDetails.graduationYear')}
                className={`w-full p-1 border rounded ${
                  errors.studentDetails?.graduationYear ? 'border-red-500' : ''
                }`}
              />
              {errors.studentDetails?.graduationYear && (
                <p className="text-red-500 text-sm">
                  {errors.studentDetails.graduationYear.message}
                </p>
              )}
            </>
          ) : (
            <p>{player.studentDetails.graduationYear}</p>
          )}
        </div>

        {/* Grade as of */}
        <div>
          <label className="block text-sm font-medium">
            Grade as of (Date)
          </label>
          {isEditing ? (
            <>
              <Input
                {...register('studentDetails.gradeAsOf')}
                className={`w-full p-1 border rounded ${
                  errors.studentDetails?.gradeAsOf ? 'border-red-500' : ''
                }`}
              />
              {errors.studentDetails?.gradeAsOf && (
                <p className="text-red-500 text-sm">
                  {errors.studentDetails.gradeAsOf.message}
                </p>
              )}
            </>
          ) : (
            <p>{player.studentDetails.gradeAsOf}</p>
          )}
        </div>
      </div>
    </section>
  );
}
