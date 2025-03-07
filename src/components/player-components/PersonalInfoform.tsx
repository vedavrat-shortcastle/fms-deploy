'use client';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Calendar } from 'lucide-react';

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
import { AddPlayerFormData } from '@/schemas/addplayer.schema';

export function PersonalInformationForm() {
  const {
    control,
    register,
    formState: { errors },
  } = useFormContext<AddPlayerFormData>();
  const [isClient, setIsClient] = useState(false);

  useEffect(() => {
    setIsClient(true);
  }, []);

  if (!isClient) return null;

  return (
    <div className="space-y-6 max-w-3xl mx-auto bg-white p-6 rounded-lg">
      <h3 className="text-2xl font-semibold text-gray-900 mb-6">
        Personal &amp; Contact Information
      </h3>

      {/* First Name */}
      <FormField
        control={control}
        name="personal.firstName"
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
            <FormMessage>{errors.personal?.firstName?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Last Name */}
      <FormField
        control={control}
        name="personal.lastName"
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
            <FormMessage>{errors.personal?.lastName?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Birth Date */}
      <FormField
        control={control}
        name="personal.birthDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900">
              Birth Date <span className="text-red-500">*</span>
            </FormLabel>
            <div className="relative">
              <FormControl>
                <Input
                  type="date"
                  {...field}
                  className="w-full p-3 pr-10 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </FormControl>
              <Calendar className="absolute right-4 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
            </div>
            <FormMessage>{errors.personal?.birthDate?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Gender */}
      <FormField
        control={control}
        name="personal.gender"
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
            <FormMessage>{errors.personal?.gender?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Email */}
      <FormField
        control={control}
        name="personal.email"
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
            <FormMessage>{errors.personal?.email?.message}</FormMessage>
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
              {...register('personal.photo')}
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
              {...register('personal.ageProof')}
              className="hidden"
            />
          </label>
        </FormControl>
      </div>
    </div>
  );
}
