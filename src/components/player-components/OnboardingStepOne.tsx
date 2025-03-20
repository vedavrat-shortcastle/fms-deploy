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
import { PhoneInput } from '@/components/phoneinput';
import DatePicker from '@/components/player-components/DatePicker';
import { Gender } from '@prisma/client';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { renderLabel } from '@/components/player-components/OtherInfoform';
import { FileUploader } from '@/components/FileUploader';

export const PlayerDetailsStepOne = () => {
  const { control, setValue } = useFormContext();
  setValue('countryCode', '+1');

  const handleCountrySelect = (country: string) => {
    setValue('countryCode', '+' + country);
  };

  const handlePhoneNumberChange = (phoneNumber: string) => {
    setValue('phoneNumber', phoneNumber);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
      <FormField
        control={control}
        name="birthDate" // Adjust the field name as needed
        render={({ field }) => (
          <FormItem>
            <FormLabel className="block text-sm text-gray-900">
              {renderLabel('Date of Birth', true)}
            </FormLabel>
            <FormControl>
              <DatePicker field={field} allowFuture={false} allowPast={true} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="gender"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900">
              {renderLabel('Gender', true)}
            </FormLabel>
            <FormControl>
              <Select
                value={field.value || 'MALE'}
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full p-3 text-sm border rounded-md focus:ring-2 focus:ring-red-500">
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

      <FormField
        control={control}
        name="streetAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900">
              Street Address
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Street Address"
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
        name="streetAddress2"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900">
              Street Address 2 (Optional)
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Street Address 2"
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
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900">Country</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Country"
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
        name="state"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900">State</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter State"
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
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900">City</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter City"
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
        name="postalCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900">Postal Code</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Postal Code"
                {...field}
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      <div className="flex gap-x-5">
        <PhoneInput
          placeholder="Your phone number"
          defaultCountry="US"
          onCountrySelect={handleCountrySelect}
          onPhoneNumberChange={handlePhoneNumberChange}
          className="w-full"
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
};
