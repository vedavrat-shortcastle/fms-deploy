'use client';

import { Input } from '@/components/ui/input';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { EditPlayerFormValues } from '@/schemas/Player.schema';
import { ReactNode } from 'react';

interface PersonalInfoSectionProps {
  register: UseFormRegister<EditPlayerFormValues>;
  errors: FieldErrors<EditPlayerFormValues>;
  isEditing: boolean;
  player: EditPlayerFormValues | null;
}

interface PersonalInfoField {
  label: string;
  fieldPath: string; // Using string to handle both baseUser and playerDetails paths
  required?: boolean;
  inputType?: string;
  editable?: boolean; // For fields that should be read-only even in edit mode
}

export default function PersonalInfoSection({
  register,
  errors,
  isEditing,
  player,
}: PersonalInfoSectionProps) {
  // Define all personal info fields in an array for easy mapping
  const personalInfoFields: PersonalInfoField[] = [
    { label: 'First Name', fieldPath: 'baseUser.firstName', required: true },
    {
      label: 'Birth Date',
      fieldPath: 'playerDetails.birthDate',
      required: true,
    },
    { label: 'Middle Name', fieldPath: 'baseUser.middleName' },
    { label: 'Gender', fieldPath: 'playerDetails.gender', required: true },
    { label: 'Last Name', fieldPath: 'baseUser.lastName', required: true },
    {
      label: 'Email',
      fieldPath: 'baseUser.email',
      required: true,
      inputType: 'email',
    },
    { label: 'Name Suffix', fieldPath: 'baseUser.nameSuffix' },
    {
      label: 'Age Proof',
      fieldPath: 'playerDetails.ageProof',
      editable: false,
    },
  ];

  // Helper function to get the value from nested path
  const getNestedValue = (obj: any, path: string): any => {
    if (!obj) return undefined;

    const parts = path.split('.');
    let value = obj;

    for (const part of parts) {
      if (value === null || value === undefined) return undefined;
      value = value[part];
    }

    return value;
  };

  // Helper function to get error from nested path
  const getNestedError = (errors: any, path: string): any => {
    if (!errors) return undefined;

    const parts = path.split('.');
    let error = errors;

    for (const part of parts) {
      if (error === null || error === undefined) return undefined;
      error = error[part];
    }

    return error;
  };

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
      <h2 className="text-xl font-semibold mb-4">
        Personal &amp; Contact Information
      </h2>
      <div className="rounded-lg border border-gray-200 bg-white p-4 grid grid-cols-2 gap-4">
        {personalInfoFields.map((field) => (
          <div key={field.fieldPath}>
            <label
              className={`block text-sm font-medium ${!isEditing ? 'mb-2' : ''}`}
            >
              {field.label}
            </label>

            {isEditing && !field.editable ? (
              <>
                <Input
                  type={field.inputType || 'text'}
                  {...register(field.fieldPath as any)}
                  className={`w-full p-1 border rounded ${
                    getNestedError(errors, field.fieldPath)
                      ? 'border-red-500'
                      : ''
                  }`}
                />
                {getNestedError(errors, field.fieldPath) && (
                  <p className="text-red-500 text-sm">
                    {getNestedError(errors, field.fieldPath).message as string}
                  </p>
                )}
              </>
            ) : (
              <p className="text-gray-700">
                {formatFieldValue(getNestedValue(player, field.fieldPath))}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
