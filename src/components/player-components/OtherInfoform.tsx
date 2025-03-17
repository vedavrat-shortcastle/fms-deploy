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
import { CreatePlayerFormValues } from '@/schemas/player.schema';
import { DatePicker } from '@/components/player-components/DatePicker';

export function OtherInfoForm() {
  const {
    control,
    setValue,
    trigger,
    formState: { errors },
  } = useFormContext<CreatePlayerFormValues>();

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
            <FormLabel>{renderLabel('School Name', true)}</FormLabel>
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
            <FormLabel>{renderLabel('Graduation Year', true)}</FormLabel>
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
            <FormLabel>{renderLabel('Grade in School', true)}</FormLabel>
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
        name="playerDetails.gradeDate"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('Grade Date (as of)', true)}</FormLabel>
            <FormControl>
              <DatePicker
                value={field.value ? new Date(field.value) : undefined} // Ensure value is a Date
                onChange={(date) => {
                  setValue('playerDetails.gradeDate', date ?? null); // Store as Date
                  trigger('playerDetails.gradeDate');
                }}
                onBlur={() => trigger('playerDetails.gradeDate')}
                placeholder="Select date"
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
                error={!!errors.playerDetails?.gradeDate}
              />
            </FormControl>
            <FormMessage>
              {errors.playerDetails?.gradeDate?.message}
            </FormMessage>
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
            <FormLabel>{renderLabel('Club Name', true)}</FormLabel>
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
