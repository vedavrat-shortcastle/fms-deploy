'use client';

import { useForm, FormProvider } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { FormBuilder } from '@/components/forms/FormBuilder';
import { AdminProfileFormConfig } from '@/config/staticFormConfigs';
import { useEffect, useState } from 'react';
import { trpc } from '@/utils/trpc';
import { Button } from '@/components/ui/button';
import { sanitizeFields } from '@/utils/sanitize';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { EditAdminFormValues, editAdminSchema } from '@/schemas/Player.schema';
import { useToast } from '@/hooks/useToast';
import { useTranslation } from 'react-i18next';

const AdminSetting = () => {
  const form = useForm<EditAdminFormValues>({
    resolver: zodResolver(editAdminSchema),
    mode: 'onChange',
  });
  const { t } = useTranslation();

  const { control, handleSubmit, reset } = form;
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false); // Edit state
  const { data: adminDetails, refetch } = trpc.user.getAdminDetails.useQuery();
  const updateAdminProfile = trpc.federation.updateAdminProfile.useMutation();

  const { toast } = useToast();

  useEffect(() => {
    if (adminDetails) {
      reset(adminDetails);
      setLoading(false);
    }
  }, [adminDetails, reset]);

  const onSubmit = async (formData: EditAdminFormValues) => {
    try {
      await updateAdminProfile.mutateAsync(formData);
      refetch(); // Refetch updated details
      setIsEditing(false); // Exit edit mode
      toast({
        title: t('success'),
        description: t('admin_update_success'),
        variant: 'default',
      });
    } catch (error) {
      console.error('Failed to update admin profile:', error);
      toast({
        title: t('success'),
        description: t('admin_update_failed'),
        variant: 'destructive',
      });
    }
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
              <fieldset disabled={!isEditing} className="space-y-6">
                <FormBuilder
                  config={{
                    id: 'admin-profile-form',
                    isActive: true,
                    fields: sanitizeFields(AdminProfileFormConfig),
                  }}
                  control={control}
                />
              </fieldset>
              <div className="flex justify-end gap-4">
                {isEditing ? (
                  <>
                    <Button type="submit">Save Changes</Button>
                    <Button
                      type="button"
                      variant="ghost"
                      onClick={() => {
                        reset(adminDetails); // Reset form to initial values
                        setIsEditing(false); // Exit edit mode
                      }}
                    >
                      Cancel
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={(e) => {
                      e.preventDefault();
                      setIsEditing(true); // Enter edit mode
                    }}
                  >
                    Edit
                  </Button>
                )}
              </div>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
    </div>
  );
};

export default AdminSetting;
