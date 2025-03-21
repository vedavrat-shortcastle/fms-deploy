'use client';

import { Input } from '@/components/ui/input';
import { UseFormRegister, FieldErrors, RegisterOptions } from 'react-hook-form';
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
  // Define all student details fields in an array for easy mapping.
  // Notice we set inputType for numeric and date fields.
  const studentDetailsFields: StudentDetailsField[] = [
    { label: 'School Name', fieldName: 'schoolName', required: false },
    { label: 'Grade in School', fieldName: 'gradeInSchool', required: false },
    {
      label: 'Graduation Year',
      fieldName: 'graduationYear',
      required: false,
      inputType: 'number',
    },
    {
      label: 'Grade as of (Date)',
      fieldName: 'gradeDate',
      required: false,
      inputType: 'date',
    },
  ];

  // Helper to format a value for read-only display.
  const formatFieldValue = (value: any): ReactNode => {
    if (value === null || value === undefined) return '—';
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value);
  };

  // Helper to provide a default value for an input.
  // For date inputs, format as yyyy-mm-dd string.
  const getDefaultValue = (field: StudentDetailsField): string | number => {
    const value = player?.playerDetails[field.fieldName];
    if (field.inputType === 'date') {
      return value ? new Date(value as Date).toISOString().split('T')[0] : '';
    }
    return value instanceof Date
      ? value.toISOString().split('T')[0]
      : (value ?? '');
  };

  // Helper to create register options.
  // For number inputs, set valueAsNumber; for date inputs, set valueAsDate.
  const getRegisterOptions = (
    field: StudentDetailsField
  ): RegisterOptions<EditPlayerFormValues, any> => {
    const options: RegisterOptions<EditPlayerFormValues, any> = {
      required: field.required,
    };
    if (field.inputType === 'number') {
      options.valueAsNumber = true;
    }
    if (field.inputType === 'date') {
      // Casting to any to avoid conflicts in react-hook-form types.
      options.valueAsDate = true as any;
    }
    return options;
  };

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Student Details</h2>
      <div className="rounded-lg border border-gray-200 bg-white p-4 grid grid-cols-2 gap-4">
        {studentDetailsFields.map((field) => (
          <div key={field.fieldName as string}>
            <label
              className={`block text-sm font-medium ${!isEditing ? 'mb-2' : ''}`}
            >
              {field.label}
            </label>
            {isEditing ? (
              <>
                <Input
                  type={field.inputType || 'text'}
                  defaultValue={getDefaultValue(field)}
                  {...register(
                    `playerDetails.${field.fieldName}` as const,
                    getRegisterOptions(field)
                  )}
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
                  ? player?.playerDetails.gradeDate
                    ? new Date(
                        player.playerDetails.gradeDate as Date
                      ).toLocaleDateString()
                    : '—'
                  : formatFieldValue(player?.playerDetails[field.fieldName])}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
