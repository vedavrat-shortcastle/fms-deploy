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

import { CreatePlayerFormValues } from '@/schemas/Player.schema';
import DatePicker from '@/components/player-components/DatePicker';
import { Gender } from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { FileUploader } from '@/components/FileUploader';

export function PersonalInformationForm() {
  const { control } = useFormContext<CreatePlayerFormValues>();
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
        name="playerDetails.birthDate" // Adjust the field name as needed
        render={({ field }) => (
          <FormItem>
            <FormLabel className="block text-sm text-gray-900">
              Date of Birth
            </FormLabel>
            <FormControl>
              <DatePicker field={field} allowFuture={false} allowPast={true} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Gender */}
      <FormField
        control={control}
        name="playerDetails.gender"
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
                  {Object.values(Gender).map((gen) => (
                    <SelectItem value={gen} key={gen}>
                      {gen}
                    </SelectItem>
                  ))}
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
        <FormField
          control={control}
          name="playerDetails.avatarUrl"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-gray-900">
                Photo Upload
              </FormLabel>
              <FormControl>
                <FileUploader
                  field={field}
                  uploadFolder="avatar"
                  accept={{ 'image/*': ['.jpeg', '.jpg', '.png'] }}
                  label="Click or drag to upload photo"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>

      {/* Age Proof Upload */}
      <div className="space-y-2">
        <FormField
          control={control}
          name="playerDetails.ageProof"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-sm text-gray-900">
                Age Proof Upload
              </FormLabel>
              <FormControl>
                <FileUploader
                  field={field}
                  uploadFolder="age-proof"
                  accept={{
                    'image/*': ['.jpeg', '.jpg', '.png'],
                    'application/pdf': ['.pdf'],
                  }}
                  label="Click or drag to upload age proof"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
      </div>
    </div>
  );
}
