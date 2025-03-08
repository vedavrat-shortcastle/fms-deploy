'use client';
import React from 'react';
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
import { AddPlayerFormData } from '@/schemas/addplayer.schema';
import { DatePicker } from '@/components/player-components/DatePicker';

export function OtherInfoForm() {
  const {
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<AddPlayerFormData>();

  const renderLabel = (text: string, isRequired: boolean = false) => (
    <>
      <span className="text-sm text-gray-900">{text}</span>
      {isRequired && <span className="text-red-500"> *</span>}
    </>
  );

  return (
    <div className="space-y-6 max-w-3xl mx-auto bg-white p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Player Details
      </h3>

      {/* FIDE ID */}
      <FormField
        control={control}
        name="other.fideId"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('FIDE ID')}</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter FIDE ID"
                {...field}
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage>{errors.other?.fideId?.message}</FormMessage>
          </FormItem>
        )}
      />

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">
        Student Details
      </h3>

      {/* School Name */}
      <FormField
        control={control}
        name="other.schoolName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('School Name', true)}</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter School Name"
                {...field}
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage>{errors.other?.schoolName?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Graduation Year */}
      <FormField
        control={control}
        name="other.graduationYear"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('Graduation Year', true)}</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Graduation Year"
                {...field}
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage>{errors.other?.graduationYear?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Grade in School */}
      <FormField
        control={control}
        name="other.grade"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('Grade in School', true)}</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Grade"
                {...field}
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage>{errors.other?.grade?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Grade as of (Date) - Using DatePicker */}
      <FormField
        control={control}
        name="other.gradeAsOf"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('Grade as of (Date)', true)}</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value ? new Date(field.value) : undefined}
                onChange={(date) => {
                  if (date) {
                    setValue('other.gradeAsOf', format(date, 'yyyy-MM-dd'));
                    // Trigger validation immediately after date change
                    trigger('other.gradeAsOf');
                  } else {
                    setValue('other.gradeAsOf', '');
                    trigger('other.gradeAsOf');
                  }
                }}
                onBlur={() => {
                  // Trigger validation on blur
                  trigger('other.gradeAsOf');
                }}
                // No disabled prop here to allow future dates
                placeholder="Select date"
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
                error={!!errors.other?.gradeAsOf}
              />
            </FormControl>
            <FormMessage>{errors.other?.gradeAsOf?.message}</FormMessage>
          </FormItem>
        )}
      />

      <h3 className="text-xl font-semibold text-gray-900 mt-6 mb-4">
        Club Information
      </h3>

      {/* Club Name */}
      <FormField
        control={control}
        name="other.clubName"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('Club Name', true)}</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Club Name"
                {...field}
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage>{errors.other?.clubName?.message}</FormMessage>
          </FormItem>
        )}
      />
    </div>
  );
}
