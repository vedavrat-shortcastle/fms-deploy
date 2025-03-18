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
import DatePicker from '@/components/player-components/DatePicker';

export const PlayerDetailsStepTwo = () => {
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
      <FormField
        control={control}
        name="fideId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900">
              FIDE ID (Optional)
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter FIDE ID"
                {...field}
                value={field.value ? field.value : ''}
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
              School Name (Optional)
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter School Name"
                {...field}
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
              Graduation Year (Optional)
            </FormLabel>
            <FormControl>
              <Input
                type="number"
                placeholder="Enter Graduation Year"
                {...field}
                value={field.value ? Number(field.value) : ''}
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
              Grade In School (Optional)
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Grade In School"
                {...field}
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="playerDetails.gradeDate" // Adjust the field name as needed
        render={({ field }) => (
          <FormItem>
            <FormLabel className="block text-sm text-gray-900">
              Grade Date
            </FormLabel>
            <FormControl>
              <DatePicker
                field={field}
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
              Club Name (Optional)
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Club Name"
                {...field}
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="clubId"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900">
              Club ID (Optional)
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Club ID"
                {...field}
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
