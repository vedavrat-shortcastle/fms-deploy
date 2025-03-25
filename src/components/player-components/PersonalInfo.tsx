'use client';

import { Input } from '@/components/ui/input';
import type {
  UseFormRegister,
  FieldErrors,
  RegisterOptions,
} from 'react-hook-form';
import type { EditPlayerFormValues } from '@/schemas/Player.schema';
import { type ReactNode } from 'react';
import AgeProofUpload from './AgeProofUpload';

interface PersonalInfoSectionProps {
  register: UseFormRegister<EditPlayerFormValues>;
  errors: FieldErrors<EditPlayerFormValues>;
  isEditing: boolean;
  player: EditPlayerFormValues | null;
  onNextTab?: () => void;
}

interface PersonalInfoField {
  label: string;
  fieldPath: string;
  required?: boolean;
  inputType?: string;
  editable?: boolean;
}

export default function PersonalInfoSection({
  register,
  errors,
  isEditing,
  player,
  onNextTab,
}: PersonalInfoSectionProps) {
  // Define all personal info fields in an array for easy mapping.
  const personalInfoFields: PersonalInfoField[] = [
    { label: 'First Name', fieldPath: 'baseUser.firstName', required: true },
    {
      label: 'Birth Date',
      fieldPath: 'playerDetails.birthDate',
      required: true,
      inputType: 'date',
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
  ];

  // Helper to get nested value from an object based on a dot-delimited path.
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

  // Helper to get nested error from an object based on a dot-delimited path.
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

  // Helper to safely format any value for display.
  const formatFieldValue = (value: any): ReactNode => {
    if (value === null || value === undefined) return '—';
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value);
  };

  // Helper to get the default value for an input.
  // For date inputs, format as yyyy-MM-dd.
  const getDefaultValue = (fieldPath: string): string | number => {
    const value = getNestedValue(player, fieldPath);
    if (fieldPath.includes('Date')) {
      return value ? new Date(value).toISOString().split('T')[0] : '';
    }
    return value ?? '';
  };

  // Helper to generate register options based on the field type.
  const getRegisterOptions = (
    field: PersonalInfoField
  ): RegisterOptions<EditPlayerFormValues, any> => {
    const options: RegisterOptions<EditPlayerFormValues, any> = {
      required: field.required,
    };

    if (field.inputType === 'date') {
      options.valueAsDate = true as any;
      options.validate = (value: any) => {
        if (value && new Date(value) > new Date()) {
          return `${field.label} cannot be in the future`;
        }
        return true;
      };
    }

    return options;
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
            {isEditing ? (
              <>
                <Input
                  type={field.inputType || 'text'}
                  defaultValue={getDefaultValue(field.fieldPath)}
                  max={
                    field.inputType === 'date'
                      ? new Date().toISOString().split('T')[0]
                      : undefined
                  }
                  {...register(
                    field.fieldPath as any,
                    getRegisterOptions(field)
                  )}
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
        {/* Age Proof Section */}
        <AgeProofUpload
          register={register}
          errors={errors}
          isEditing={isEditing}
          player={player}
          onNextTab={onNextTab}
        />
      </div>
    </section>
  );
}
