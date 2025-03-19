'use client';

import { Input } from '@/components/ui/input';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { EditPlayerFormValues } from '@/schemas/Player.schema';
import { ReactNode } from 'react';

interface AddressSectionProps {
  register: UseFormRegister<EditPlayerFormValues>;
  errors: FieldErrors<EditPlayerFormValues>;
  isEditing: boolean;
  player: EditPlayerFormValues | null;
}

interface AddressField {
  label: string;
  fieldName: keyof EditPlayerFormValues['playerDetails'];
  required?: boolean;
}

export default function AddressSection({
  register,
  errors,
  isEditing,
  player,
}: AddressSectionProps) {
  // Define all address fields in an array for easy mapping
  const addressFields: AddressField[] = [
    { label: 'Street Address', fieldName: 'streetAddress', required: true },
    { label: 'Postal Code', fieldName: 'postalCode', required: true },
    { label: 'Street Address Line 2', fieldName: 'streetAddress2' },
    { label: 'Country', fieldName: 'country', required: true },
    { label: 'City', fieldName: 'city', required: true },
    { label: 'Phone Number', fieldName: 'phoneNumber', required: true },
    { label: 'State/Province', fieldName: 'state', required: true },
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
      <h2 className="text-xl font-semibold mb-4">Mailing Address</h2>
      <div className="rounded-lg border border-gray-200 bg-white p-4 grid grid-cols-2 gap-4">
        {addressFields.map((field) => (
          <div key={field.fieldName}>
            <label
              className={`block text-sm font-medium ${!isEditing ? 'mb-2' : ''}`}
            >
              {field.label}
            </label>

            {isEditing ? (
              <>
                <Input
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
                {formatFieldValue(player?.playerDetails[field.fieldName])}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
