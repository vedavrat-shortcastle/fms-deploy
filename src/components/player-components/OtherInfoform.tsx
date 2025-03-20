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
import { CreatePlayerFormValues } from '@/schemas/Player.schema';
import DatePicker from '@/components/player-components/DatePicker';
import { renderLabel } from '@/components/RenderLable';

export function OtherInfoForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreatePlayerFormValues>();

  return (
    <div className="space-y-6 max-w-3xl mx-auto bg-white p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Player Details
      </h3>

      {/* FIDE ID */}
      <FormField
        control={control}
        name="playerDetails.fideId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('FIDE ID')}</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter FIDE ID"
                {...field}
                value={field.value || ''} // Ensure value is never undefined
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage>{errors.playerDetails?.fideId?.message}</FormMessage>
          </FormItem>
        )}
      />

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">
        Student Details
      </h3>

      {/* School Name */}
      <FormField
        control={control}
        name="playerDetails.schoolName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('School Name')}</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter School Name"
                {...field}
                value={field.value || ''} // Ensure value is never undefined
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage>
              {errors.playerDetails?.schoolName?.message}
            </FormMessage>
          </FormItem>
        )}
      />

      {/* Graduation Year */}
      <FormField
        control={control}
        name="playerDetails.graduationYear"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('Graduation Year')}</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Graduation Year"
                type="number"
                {...field}
                value={field.value || ''} // Ensure value is never undefined
                onChange={(e) =>
                  field.onChange(
                    e.target.value === '' ? undefined : Number(e.target.value)
                  )
                }
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage>
              {errors.playerDetails?.graduationYear?.message}
            </FormMessage>
          </FormItem>
        )}
      />

      {/* Grade in School */}
      <FormField
        control={control}
        name="playerDetails.gradeInSchool"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('Grade in School')}</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Grade"
                {...field}
                value={field.value || ''} // Ensure value is never undefined
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage>
              {errors.playerDetails?.gradeInSchool?.message}
            </FormMessage>
          </FormItem>
        )}
      />
      {/* Grade Date (as of) using DatePicker */}
      <FormField
        control={control}
        name="playerDetails.gradeDate" // Adjust the field name as needed
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('Grade Date (as of)')}</FormLabel>

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

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">
        Club Information
      </h3>

      {/* Club Name */}
      <FormField
        control={control}
        name="playerDetails.clubName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('Club Name')}</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Club Name"
                {...field}
                value={field.value || ''} // Ensure value is never undefined
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage>{errors.playerDetails?.clubName?.message}</FormMessage>
          </FormItem>
        )}
      />
    </div>
  );
}
