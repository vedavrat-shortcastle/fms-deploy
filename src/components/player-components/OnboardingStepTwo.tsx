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
import { S3Service } from '@/lib/s3service';

export const PlayerDetailsStepTwo = () => {
  const { control, register } = useFormContext();
  const { generatePresignedUploadUrl } = new S3Service();

  const handleAvatarUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    console.log('Uploading file:', file);
    generatePresignedUploadUrl(file.name, 'avatarUrl').then((url) => {
      console.log('Presigned URL:', url);
    });
  };

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
              onChange={handleAvatarUpload}
            />
          </label>
        </FormControl>
      </div>
    </div>
  );
};
