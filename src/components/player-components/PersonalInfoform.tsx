'use client';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';

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
import { CreatePlayerFormValues } from '@/schemas/player.schema';

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
        name="baseUser.firstName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900">
              First Name <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter First Name"
                {...field}
                value={field.value || ''} // Ensure value is never undefined
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
        name="baseUser.lastName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900">
              Last Name <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Last Name"
                {...field}
                value={field.value || ''} // Ensure value is never undefined
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Birth Date */}
      <FormField
        control={control}
        name="playerDetails.birthDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900">
              Birth Date <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <DatePicker
                value={field.value ? new Date(field.value) : undefined} // Ensure it's a valid Date
                onChange={(date) => {
                  if (date) {
                    setValue('playerDetails.birthDate', date); // Store as Date object
                  } else {
                    setValue('playerDetails.birthDate', new Date()); // Provide a default date
                  }
                  trigger('playerDetails.birthDate');
                }}
                onBlur={() => trigger('playerDetails.birthDate')}
                disabled={(date) => date > today}
                placeholder="Select birth date"
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
                error={!!errors?.playerDetails?.birthDate}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Gender */}
      <FormField
        control={control}
        name="baseUser.gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900">
              Gender <span className="text-red-500">*</span>
            </FormLabel>
            <FormControl>
              <Select
                value={field.value || 'MALE'} // Provide default to ensure it's not undefined
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500">
                  <SelectValue placeholder="Select Gender" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="MALE">Male</SelectItem>
                  <SelectItem value="FEMALE">Female</SelectItem>
                  <SelectItem value="OTHER">Other</SelectItem>
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
        name="baseUser.email"
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
                value={field.value || ''} // Ensure value is never undefined
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
              {...register('playerDetails.avatarUrl')}
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
              {...register('playerDetails.ageProof')}
              className="hidden"
            />
          </label>
        </FormControl>
      </div>
    </div>
  );
}
