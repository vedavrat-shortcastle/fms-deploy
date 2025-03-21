'use client';
import { Loader } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';

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
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<ChangePasswordFormValues>({
    resolver: zodResolver(changePasswordSchema),
  });

  const handleClose = () => {
    if (!isChangingPassword) {
      reset();
      onOpenChange(false);
    }
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
        <form onSubmit={handleSubmit(onSubmit)} className="grid gap-4 py-4">
          <div className="grid gap-2">
            <Label htmlFor="oldPassword">Old Password</Label>
            <Input
              id="oldPassword"
              type="password"
              {...register('oldPassword')}
            />
            {errors.oldPassword && (
              <p className="text-sm text-destructive mt-1">
                {errors.oldPassword.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="newPassword">New Password</Label>
            <Input
              id="newPassword"
              type="password"
              {...register('newPassword')}
            />
            {errors.newPassword && (
              <p className="text-sm text-destructive mt-1">
                {errors.newPassword.message}
              </p>
            )}
          </div>
          <div className="grid gap-2">
            <Label htmlFor="confirmNewPassword">Confirm New Password</Label>
            <Input
              id="confirmNewPassword"
              type="password"
              {...register('confirmNewPassword')}
            />
            {errors.confirmNewPassword && (
              <p className="text-sm text-destructive mt-1">
                {errors.confirmNewPassword.message}
              </p>
            )}
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
      </DialogContent>
    </Dialog>
  );
}
