'use client';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { format } from 'date-fns';

import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { DatePicker } from '@/components/player-components/DatePicker';
import { CreatePlayerFormValues } from '@/schemas/Player.schema';

export function PersonalInformationForm() {
  const {
    control,
    register,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<CreatePlayerFormValues>();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  // Get current date for maximum date validation
  const today = new Date();

  if (!isClient) return null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto bg-white p-6 rounded-lg">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">
        Personal &amp; Contact Information
      </h3>

      {/* First Name */}
      <FormField
        control={control}
        name="firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900">
              First Name <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter First Name"
                {...field}
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Last Name */}
      <FormField
        control={control}
        name="lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900">
              Last Name <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Last Name"
                {...field}
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Birth Date with custom DatePicker */}
      <FormField
        control={control}
        name="birthDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900">
              Birth Date <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <DatePicker
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => {
                  if (date) {
                    setValue('birthDate', format(date, 'yyyy-MM-dd'));
                    // Trigger validation immediately after date change
                    trigger('birthDate');
                  } else {
                    setValue('birthDate', '');
                    trigger('birthDate');
                  }
                }}
                onBlur={() => {
                  // Trigger validation on blur
                  trigger('birthDate');
                }}
                disabled={(date) => date > today}
                placeholder="Select birth date"
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
                error={!!errors?.birthDate}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Gender */}
      <FormField
        control={control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900">
              Gender <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                  <SelectItem value="Other">Other</SelectItem>
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Email */}
      <FormField
        control={control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900">
              Email <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Email"
                type="email"
                {...field}
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Photo Upload */}
      <div className="space-y-2">
        <FormLabel className="text-sm text-gray-900">Photo Upload</FormLabel>
        <FormControl>
          <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <span className="text-base text-gray-900">
              Click to upload a photo
            </span>
            <Input
              type="file"
              accept=".jpg,.jpeg,.png"
              {...register('avatarUrl')}
              className="hidden"
            />
          </label>
        </FormControl>
      </div>

      {/* Age Proof Upload */}
      <div className="space-y-2">
        <FormLabel className="text-sm text-gray-900">
          Age Proof Upload
        </FormLabel>
        <FormControl>
          <label className="flex flex-col items-center justify-center w-full p-4 border-2 border-dashed border-gray-300 rounded-lg cursor-pointer hover:bg-gray-50">
            <span className="text-base text-gray-900">
              Click to upload age proof
            </span>
            <Input
              type="file"
              accept=".pdf,.jpg,.jpeg,.png"
              {...register('ageProof')}
              className="hidden"
            />
          </label>
        </FormControl>
      </div>
    </div>
  );
}
