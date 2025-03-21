'use client';

import { Input } from '@/components/ui/input';
import type { UseFormRegister, FieldErrors } from 'react-hook-form';
import type { EditPlayerFormValues } from '@/schemas/Player.schema';
import { type ReactNode, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from '@/components/ui/dialog';
import { Download, Eye } from 'lucide-react';

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
  const [isAgeProofOpen, setIsAgeProofOpen] = useState(false);

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

  // Helper to render the Age Proof field differently
  const renderAgeProofField = (fieldPath: string) => {
    const ageProofUrl = getNestedValue(player, fieldPath);

    if (!ageProofUrl) return '—';

    // Determine file type for preview (basic detection)
    const isImage = /\.(jpg|jpeg|png|gif|webp)$/i.test(ageProofUrl);
    const isPdf = /\.pdf$/i.test(ageProofUrl);

    return (
      <Dialog open={isAgeProofOpen} onOpenChange={setIsAgeProofOpen}>
        <DialogTrigger asChild>
          <Button
            variant="outline"
            size="sm"
            className="flex items-center gap-2"
          >
            <Eye className="h-4 w-4" /> View Document
          </Button>
        </DialogTrigger>
        <DialogContent className="sm:max-w-[800px] max-h-[90vh]">
          <DialogHeader>
            <DialogTitle>Age Proof Document</DialogTitle>
          </DialogHeader>
          <div className="flex flex-col items-center gap-4">
            <div className="w-full h-[500px] overflow-auto border rounded-md">
              {isImage ? (
                <img
                  src={ageProofUrl || '/placeholder.svg'}
                  alt="Age Proof Document"
                  className="w-full h-auto object-contain"
                />
              ) : isPdf ? (
                <iframe
                  src={`${ageProofUrl}#toolbar=0`}
                  className="w-full h-full"
                  title="Age Proof Document"
                />
              ) : (
                <div className="flex items-center justify-center h-full">
                  <p>Preview not available for this file type</p>
                </div>
              )}
            </div>
            <Button
              variant="default"
              onClick={() => {
                window.open(ageProofUrl, '_blank');
              }}
              className="flex items-center gap-2"
            >
              <Download className="h-4 w-4" /> Download Document
            </Button>
          </div>
        </DialogContent>
      </Dialog>
    );
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
                {field.fieldPath === 'playerDetails.ageProof'
                  ? renderAgeProofField(field.fieldPath)
                  : formatFieldValue(getNestedValue(player, field.fieldPath))}
              </p>
            )}
          </div>
        ))}
      </div>
    </section>
  );
}
