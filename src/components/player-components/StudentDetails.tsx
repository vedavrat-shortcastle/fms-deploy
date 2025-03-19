'use client';

import { Input } from '@/components/ui/input';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { EditPlayerFormValues } from '@/schemas/Player.schema';
import { ReactNode } from 'react';

interface StudentDetailsSectionProps {
  register: UseFormRegister<EditPlayerFormValues>;
  errors: FieldErrors<EditPlayerFormValues>;
  isEditing: boolean;
  player: EditPlayerFormValues | null;
}

interface StudentDetailsField {
  label: string;
  fieldName: keyof EditPlayerFormValues['playerDetails'];
  required?: boolean;
  inputType?: string;
}

export default function StudentDetailsSection({
  register,
  errors,
  isEditing,
  player,
}: StudentDetailsSectionProps) {
  // Define all student details fields in an array for easy mapping
  const studentDetailsFields: StudentDetailsField[] = [
    { label: 'School Name', fieldName: 'schoolName', required: true },
    { label: 'Grade in School', fieldName: 'gradeInSchool', required: true },
    { label: 'Graduation Year', fieldName: 'graduationYear', required: true },
    { label: 'Grade as of (Date)', fieldName: 'gradeDate', required: true },
  ];

  // Helper function to safely convert any value to ReactNode
  const formatFieldValue = (value: any): ReactNode => {
    if (value === null || value === undefined) {
      return '—';
    }

    if (value instanceof Date) {
      return value.toLocaleDateString();
    }

    return String(value);
  };

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Student Details</h2>
      <div className="rounded-lg border border-gray-200 bg-white p-4 grid grid-cols-2 gap-4">
        {studentDetailsFields.map((field) => (
          <div key={field.fieldName}>
            <label
              className={`block text-sm font-medium ${!isEditing ? 'mb-2' : ''}`}
            >
              {field.label}
            </label>

            {isEditing ? (
              <>
                <Input
                  type={field.inputType || 'text'}
                  {...register(`playerDetails.${field.fieldName}`)}
                  className={`w-full p-1 border rounded ${
                    errors?.playerDetails?.[field.fieldName]
                      ? 'border-red-500'
                      : ''
                  }`}
                />
                {errors?.playerDetails?.[field.fieldName] && (
                  <p className="text-red-500 text-sm">
                    {errors.playerDetails[field.fieldName]?.message as string}
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-700">
                {field.fieldName === 'gradeDate'
                  ? player?.playerDetails.gradeDate?.toString() || '—'
                  : formatFieldValue(player?.playerDetails[field.fieldName])}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
