'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Button } from '@/components/ui/button';
import Loader from '@/components/Loader';
import { useSession } from 'next-auth/react';
import { useToast } from '@/hooks/useToast';
import { trpc } from '@/utils/trpc';
import { FormBuilder } from '@/components/forms/FormBuilder';
import { useFormConfig } from '@/hooks/useFormConfig';
import {
  type EditParentFormValues,
  editParentSchema,
} from '@/schemas/Parent.schema';

// Define base user fields similar to the player implementation
const baseUserFields = ['id', 'email', 'firstName', 'lastName'];

export default function ParentSettings() {
  const session = useSession();
  const router = useRouter();
  const parentId = session.data?.user.id;
  const { toast } = useToast();

  const [isEditing, setIsEditing] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Use the FormProvider from react-hook-form
  const methods = useForm<EditParentFormValues>({
    resolver: zodResolver(editParentSchema),
    mode: 'onChange',
  });

  const { handleSubmit, reset, control, getValues } = methods;

  // Fetch form configuration using the custom hook
  const { config, isLoading: isConfigLoading } = useFormConfig('PARENT');

  // Fetch parent details using tRPC
  const { data, error, isLoading, refetch } =
    trpc.parent.getParentById.useQuery(
      { id: parentId! },
      { enabled: !!parentId }
    );

  // Map parent data similar to the player implementation
  const mapParentData = (data: any): EditParentFormValues => ({
    baseUser: {
      id: data.id,
      email: data.email,
      firstName: data.firstName,
      lastName: data.lastName,
    },
    parentDetails: {
      streetAddress: data.streetAddress || '',
      streetAddress2: data.streetAddress2 || '',
      city: data.city || '',
      state: data.state || '',
      postalCode: data.postalCode || '',
      country: data.country || '',
      phoneNumber: data.phoneNumber ?? '',
      countryCode: data.countryCode ?? '',
    },
  });

  useEffect(() => {
    if (data) {
      const mappedParent = mapParentData(data);
      reset(mappedParent);
    }

    if (error) {
      console.error('Error fetching parent details:', error);
      toast({
        title: 'Error',
        description: `Error fetching parent details: ${error.message}`,
        variant: 'destructive',
      });
    }
  }, [data, error, reset, toast]);

  // Mutation for editing parent details
  const editParentMutation = trpc.parent.editParentById.useMutation({
    onSuccess: () => {
      setIsEditing(false);
      refetch();
      toast({
        title: 'Success',
        description: 'Parent details updated successfully!',
        variant: 'default',
      });
      setIsSubmitting(false);
    },
    onError: (err: any) => {
      console.error('Failed to update parent details:', err.message);
      setIsSubmitting(false);
      toast({
        title: 'Error',
        description: `Failed to update parent details: ${err.message}`,
        variant: 'destructive',
      });
    },
  });

  const onSubmit = (formData: EditParentFormValues) => {
    setIsSubmitting(true);
    if (!parentId) {
      toast({
        title: 'Error',
        description: 'Parent ID is missing.',
        variant: 'destructive',
      });
      setIsSubmitting(false);
      return;
    }

    const updatedFormData = {
      baseUser: {
        ...formData.baseUser,
        id: parentId,
      },
      parentDetails: {
        ...formData.parentDetails,
      },
    };

    editParentMutation.mutate(updatedFormData);
  };

  const handleEditToggle = () => {
    if (isEditing) {
      handleSubmit(onSubmit)();
    } else {
      setIsEditing(true);
    }
  };

  const handleCancel = () => {
    setIsEditing(false);
    if (data) reset(mapParentData(data));
  };

  // Sanitize fields similar to the player implementation
  const sanitizeFields = (fields: any[]) =>
    fields.map((field) => ({
      ...field,
      defaultValue: field.defaultValue ?? undefined,
      placeholder: field.placeholder ?? undefined,
      validations:
        typeof field.validations === 'object' &&
        !Array.isArray(field.validations)
          ? field.validations
          : undefined,
    }));

  const renderFormFields = () => {
    if (!config?.fields) return null;

    const sanitizedFields = sanitizeFields(
      config.fields.map((field) => ({
        ...field,
        prefix: baseUserFields.includes(field.fieldName)
          ? 'baseUser'
          : 'parentDetails',
        dependentValue: {
          country: getValues('parentDetails.country'),
          state: getValues('parentDetails.state'),
        },
      }))
    );

    const baseUserFieldsConfig = sanitizedFields.filter(
      (field) => field.prefix === 'baseUser'
    );
    const parentDetailsFieldsConfig = sanitizedFields.filter(
      (field) => field.prefix === 'parentDetails'
    );

    return (
      <>
        <FormBuilder
          config={{
            ...config,
            fields: baseUserFieldsConfig,
          }}
          control={control}
          basePrefix="baseUser." // Pass correct prefix for baseUser fields
        />
        <FormBuilder
          config={{
            ...config,
            fields: parentDetailsFieldsConfig,
          }}
          control={control}
          basePrefix="parentDetails." // Pass correct prefix for parentDetails fields
        />
      </>
    );
  };

  if (isLoading || isConfigLoading) {
    return (
      <div className="flex min-h-svh justify-center items-center">
        <Loader />
      </div>
    );
  }

  return (
    <FormProvider {...methods}>
      <div className="flex min-h-svh bg-[#f6f6f6]">
        <div className="flex-1 p-8">
          <Button
            variant="ghost"
            className="mb-6"
            onClick={() => router.push('/parents')}
            disabled={isSubmitting}
          >
            Back
          </Button>

          <div className="bg-white p-6 rounded-lg shadow">
            <fieldset disabled={!isEditing}>{renderFormFields()}</fieldset>

            {isEditing ? (
              <div className="flex justify-end gap-4 mt-6">
                <Button
                  variant="ghost"
                  onClick={handleCancel}
                  disabled={isSubmitting}
                >
                  Cancel
                </Button>
                <Button
                  type="submit"
                  onClick={handleSubmit(onSubmit)}
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Saving...' : 'Save changes'}
                </Button>
              </div>
            ) : (
              <div className="flex flex-col gap-4 mt-6">
                <Button variant="outline" onClick={handleEditToggle}>
                  Edit Details
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </FormProvider>
  );
}
