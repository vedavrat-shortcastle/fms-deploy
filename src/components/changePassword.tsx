'use client';
import { FormInput, Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';

import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Form,
  FormControl,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';

// Define schema for change password form
const changePasswordSchema = z
  .object({
    oldPassword: z
      .string()
      .min(6, 'Old password must be at least 6 characters.'),
    newPassword: z
      .string()
      .min(6, 'New password must be at least 6 characters.'),
    confirmNewPassword: z
      .string()
      .min(6, 'Confirm new password must be at least 6 characters.'),
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: "Passwords don't match",
    path: ['confirmNewPassword'],
  });

type ChangePasswordFormValues = z.infer<typeof changePasswordSchema>;

interface ChangePasswordDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: ChangePasswordFormValues) => void;
  isChangingPassword: boolean;
}

export function ChangePasswordDialog({
  open,
  onOpenChange,
  onSubmit,
  isChangingPassword,
}: ChangePasswordDialogProps) {
  const { handleSubmit, register } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });
  const form = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const handleClose = (): void => {
    onOpenChange(false);
  };
  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Change Password</DialogTitle>
          <DialogDescription>
            Enter your current password and a new password to update your
            credentials.
          </DialogDescription>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
            <div className="grid gap-2">
              <FormControl>
                <FormLabel htmlFor="oldPassword">Old Password</FormLabel>
                <FormInput
                  id="oldPassword"
                  type="password"
                  {...register('oldPassword')}
                />
                <FormMessage />
              </FormControl>
            </div>

            <div className="grid gap-2">
              <FormControl>
                <FormLabel htmlFor="newPassword">New Password</FormLabel>
                <FormInput
                  id="newPassword"
                  type="password"
                  {...register('newPassword')}
                />
                <FormMessage />
              </FormControl>
            </div>

            <div className="grid gap-2">
              <FormControl>
                <FormLabel htmlFor="confirmNewPassword">
                  Confirm New Password
                </FormLabel>
                <FormInput
                  id="confirmNewPassword"
                  type="password"
                  {...register('confirmNewPassword')}
                />
                <FormMessage />
              </FormControl>
            </div>

            <DialogFooter>
              <Button
                type="button"
                variant="secondary"
                onClick={handleClose}
                disabled={isChangingPassword}
              >
                Cancel
              </Button>
              <Button type="submit" disabled={isChangingPassword}>
                {isChangingPassword ? (
                  <>
                    <Loader className="mr-2 h-4 w-4 animate-spin" />
                    Changing...
                  </>
                ) : (
                  'Change Password'
                )}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
