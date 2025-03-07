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
import { AddPlayerFormData } from '@/schemas/addplayer.schema';

export function OtherInfoForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext<AddPlayerFormData>();

  const renderLabel = (text: string, isRequired: boolean = false) => (
    <>
      {text}
      {isRequired && <span className="text-red-500"> *</span>}
    </>
  );

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        Player Details
      </h3>

      {/* FIDE ID */}
      <FormField
        control={undefined as any}
        name="other.fideId"
        render={() => (
          <FormItem>
            <FormLabel>{renderLabel('FIDE ID')}</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter FIDE ID"
                {...register('other.fideId')}
              />
            </FormControl>
            <FormMessage>{errors.other?.fideId?.message}</FormMessage>
          </FormItem>
        )}
      />

      <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-4">
        Student Details
      </h3>

      {/* School Name */}
      <FormField
        control={undefined as any}
        name="other.schoolName"
        render={() => (
          <FormItem>
            <FormLabel>{renderLabel('School Name', true)}</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter School Name"
                {...register('other.schoolName')}
              />
            </FormControl>
            <FormMessage>{errors.other?.schoolName?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Graduation Year */}
      <FormField
        control={undefined as any}
        name="other.graduationYear"
        render={() => (
          <FormItem>
            <FormLabel>{renderLabel('Graduation Year', true)}</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Graduation Year"
                {...register('other.graduationYear')}
              />
            </FormControl>
            <FormMessage>{errors.other?.graduationYear?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Grade in School */}
      <FormField
        control={undefined as any}
        name="other.grade"
        render={() => (
          <FormItem>
            <FormLabel>{renderLabel('Grade in School', true)}</FormLabel>
            <FormControl>
              <Input placeholder="Enter Grade" {...register('other.grade')} />
            </FormControl>
            <FormMessage>{errors.other?.grade?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Grade as of (Date) */}
      <FormField
        control={undefined as any}
        name="other.gradeAsOf"
        render={() => (
          <FormItem>
            <FormLabel>{renderLabel('Grade as of (Date)', true)}</FormLabel>
            <FormControl>
              <Input type="date" {...register('other.gradeAsOf')} />
            </FormControl>
            <FormMessage>{errors.other?.gradeAsOf?.message}</FormMessage>
          </FormItem>
        )}
      />

      <h3 className="text-xl font-semibold text-gray-700 mt-6 mb-4">
        Club Information
      </h3>

      {/* Club Name */}
      <FormField
        control={undefined as any}
        name="other.clubName"
        render={() => (
          <FormItem>
            <FormLabel>{renderLabel('Club Name', true)}</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Club Name"
                {...register('other.clubName')}
              />
            </FormControl>
            <FormMessage>{errors.other?.clubName?.message}</FormMessage>
          </FormItem>
        )}
      />
    </div>
  );
}
