'use client';

import React, { useEffect } from 'react';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import { toast } from '@/hooks/useToast';
import { trpc } from '@/utils/trpc';
import { FormBuilder } from '@/components/forms/FormBuilder';
import { useFormConfig } from '@/hooks/useFormConfig';
import {
  planFormValues,
  createPlanSchema,
  planFormDefaults,
} from '@/schemas/Membership.schema';

export default function PlanForm({ onClose }: { onClose: () => void }) {
  const { config, isLoading: isConfigLoading } = useFormConfig('MEMBERSHIP');
  const createPlan = trpc.membership.createPlan.useMutation();

  const form = useForm<planFormValues>({
    resolver: zodResolver(createPlanSchema),
    mode: 'onTouched',
    defaultValues: planFormDefaults,
  });

  const { handleSubmit, control, reset } = form;

  // Update form with configuration when loaded
  useEffect(() => {
    if (config) {
      const customFields = config.fields
        .filter((field) => field.isCustomField)
        .reduce(
          (acc, field) => ({
            ...acc,
            [field.fieldName]: field.defaultValue ?? undefined,
          }),
          {}
        );

      form.reset({
        ...planFormDefaults,
        ...customFields,
      });
    }
  }, [config]);

  const onSubmit = async (data: planFormValues) => {
    try {
      // Format benefits if it's a string (backward compatibility)
      const formattedData = {
        ...data,
        benefits:
          typeof data.benefits === 'string'
            ? (data.benefits as string)
                .split(',')
                .map((item: string) => item.trim())
                .filter(Boolean)
            : data.benefits,
      };

      // Call the mutation and wait for the result
      await createPlan.mutateAsync(formattedData);

      toast({
        title: 'Plan created successfully',
        description: 'Your membership plan has been created',
        variant: 'default',
      });

      reset();
      onClose(); // Close the modal after successful submission
    } catch (error: any) {
      toast({
        title: 'Error creating plan',
        description: error.message,
        variant: 'destructive',
      });
      console.error('Error creating plan:', error);
    }
  };

  if (isConfigLoading) {
    return <div>Loading form configuration...</div>;
  }

  // Utility function to sanitize fields
  const sanitizeFields = (fields: any[]) => {
    return fields.map((field) => ({
      ...field,
      defaultValue: field.defaultValue ?? undefined,
      placeholder: (field.placeholder || field.displayName) ?? undefined,
      validations: field.validations ?? undefined,
    }));
  };

  return (
    <div className="max-w-3xl mx-auto">
      <div className="flex flex-col items-center">
        <div className="w-full max-w-3xl p-0 border rounded-lg shadow-md">
          <div className="p-3">
            <FormProvider {...form}>
              <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
                {config && (
                  <FormBuilder
                    config={{
                      ...config,
                      fields: sanitizeFields(config.fields),
                    }}
                    control={control}
                  />
                )}

                {/* Buttons */}
                <div className="flex justify-end mt-4 gap-2">
                  <Button type="button" variant="outline" onClick={onClose}>
                    Cancel
                  </Button>
                  <Button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700"
                    disabled={createPlan.isLoading}
                  >
                    {createPlan.isLoading ? 'Saving...' : 'Save'}
                  </Button>
                </div>
              </form>
            </FormProvider>
          </div>
        </div>
      </div>
    </div>
  );
}
