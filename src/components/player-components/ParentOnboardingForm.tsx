'use client';
import React, { useEffect } from 'react';
import { useFormContext } from 'react-hook-form';
import { useFormConfig } from '@/hooks/useFormConfig';
import { FormBuilder } from '@/components/forms/FormBuilder';

export const ParentOnboardingForm = () => {
  const { control, setValue, watch } = useFormContext();
  const { config, isLoading: isConfigLoading } = useFormConfig('PARENT');

  // Set a default phone country code on mount
  useEffect(() => {
    setValue('countryCode', '+1');
  }, [setValue]);

  // Organize form fields into sections
  const FORM_SECTIONS = {
    address: {
      fields: [
        'streetAddress',
        'streetAddress2',
        'country',
        'state',
        'city',
        'postalCode',
        'phoneNumber',
      ],
      prefix: 'parent',
    },
  };

  // Utility function to sanitize fields (reused from AddPlayerPage)
  const sanitizeFields = (fields: any) => {
    return fields.map((field: any) => ({
      ...field,
      defaultValue: field.defaultValue ?? undefined,
      placeholder: (field.placeholder || field.displayName) ?? undefined,
      validations: field.validations ?? undefined,
    }));
  };

  if (isConfigLoading) {
    return <div>Loading form configuration...</div>;
  }

  if (!config) {
    return <div>Form configuration not available</div>;
  }

  // Get fields for the address section
  const getFieldsForSection = () => {
    const sanitizedFields = sanitizeFields(config.fields);
    const fields = sanitizedFields.filter(
      (field: any) =>
        FORM_SECTIONS.address.fields.includes(field.fieldName) ||
        field.isCustomField
    );

    return fields.map((field: any) => ({
      ...field,
      prefix: FORM_SECTIONS.address.prefix,
      dependentValue: {
        country: watch('parent.country'),
        state: watch('parent.state'),
      },
    }));
  };

  const sectionFields = getFieldsForSection();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
      {sectionFields.map((field: any) => (
        <FormBuilder
          key={field.id}
          config={{
            ...config,
            fields: [field],
          }}
          control={control}
          basePrefix={`${field.prefix}.`}
        />
      ))}
    </div>
  );
};
