'use client';
import React from 'react';
import { useFormContext } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import DatePicker from '@/components/DatePicker';
import { FileUploader } from '@/components/FileUploader';
import { playerOnboardingInput } from '@/schemas/Player.schema';
import { renderLabel } from '@/components/RenderLabel';

export const PlayerDetailsStepTwo = () => {
  const { control } = useFormContext<playerOnboardingInput>();

  return (
    <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-2 lg:grid-cols-2">
      <FormField
        control={control}
        name="fideId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900">
              {renderLabel('FIDE ID')}
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter FIDE ID"
                {...field}
                value={field.value ?? ''}
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="schoolName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900">
              {renderLabel('School Name')}
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter School Name"
                {...field}
                value={field.value ?? ''}
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="graduationYear"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900">
              {renderLabel('Graduation Year')}
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter Graduation Year"
                {...field}
                value={field.value ? Number(field.value) : undefined}
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="gradeInSchool"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900">
              {renderLabel('Grade In School')}
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Grade In School"
                {...field}
                value={field.value ?? ''}
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="gradeDate" // Adjust the field name as needed
        render={({ field }) => (
          <FormItem>
            <FormLabel className="block text-sm text-gray-900">
              {renderLabel('Grade Date')}
            </FormLabel>
            <FormControl>
              <DatePicker
                field={{ ...field, value: field.value ?? undefined }}
                allowFuture={false} // Example: disallow future dates
                allowPast={true}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="clubName"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900">
              {renderLabel('Club Name')}
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Club Name"
                {...field}
                value={field.value ?? ''}
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
          name="avatarUrl"
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
    </div>
  );
};
