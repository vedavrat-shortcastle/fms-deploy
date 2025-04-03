'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormBuilder } from '@/components/forms/FormBuilder';
import { AdminProfileFormConfig } from '@/config/staticFormConfigs';
import { useEffect, useState } from 'react';
import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/button';
import { sanitizeFields } from '@/utils/sanitize';
import { z } from 'zod';
import { SupportedLanguages } from '@prisma/client';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const adminProfileSchema = z.object({
  firstName: z.string().min(2).max(50).optional(),
  lastName: z.string().min(2).max(50).optional(),
  middleName: z.string().nullable(),
  password: z.string().min(8).optional(),
  nameSuffix: z.string().nullable(),
  email: z.string().email().optional(),
  language: z.nativeEnum(SupportedLanguages),
});

type AdminProfileFormValues = z.infer<typeof adminProfileSchema>;

const AdminSetting = () => {
  const form = useForm<AdminProfileFormValues>({
    resolver: zodResolver(adminProfileSchema),
    mode: 'onChange',
  });

  const { control, handleSubmit, reset } = form;
  const [loading, setLoading] = useState(true);
  const { data: adminDetails, refetch } = trpc.user.getAdminDetails.useQuery();

  useEffect(() => {
    if (adminDetails) {
      reset(adminDetails);
      setLoading(false);
    }
  }, [adminDetails, reset]);

  const onSubmit = async (formData: AdminProfileFormValues) => {
    console.log('Form Data:', formData);
    // Call API to update admin profile
    // await updateAdminProfile(formData);
    refetch(); // Refetch updated details
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div className="flex justify-center items-center min-h-screen bg-[#f6f6f6] p-6">
      <Card className="w-full max-w-3xl">
        <CardHeader>
          <CardTitle>Admin Profile Settings</CardTitle>
        </CardHeader>
        <CardContent>
          <FormProvider {...form}>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              <FormBuilder
                config={{
                  id: 'admin-profile-form',
                  isActive: true,
                  fields: sanitizeFields(AdminProfileFormConfig),
                }}
                control={control}
              />
              <div className="flex justify-end gap-4">
                <Button type="submit">Save Changes</Button>
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetting;
