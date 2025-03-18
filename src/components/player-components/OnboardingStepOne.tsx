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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import DatePicker from '@/components/player-components/DatePicker';

export const PlayerDetailsStepOne = () => {
  const { control } = useFormContext();

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
      <FormField
        control={control}
        name="birthDate" // Adjust the field name as needed
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

      <FormField
        control={control}
        name="avatarUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900">
              Avatar URL (Optional)
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Avatar URL"
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
        name="ageProof"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900">Age Proof</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Age Proof"
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
        <FormField
          control={control}
          name="countryCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-input-grey">Country Code</FormLabel>
              <FormControl>
                <Select
                  onValueChange={field.onChange}
                  defaultValue={field.value}
                >
                  <SelectTrigger className="w-[125px] h-[42px]">
                    <SelectValue placeholder="Code" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="+91">+91 (India)</SelectItem>
                    <SelectItem value="+1">+1 (USA)</SelectItem>
                    <SelectItem value="+64">+64 (NZ)</SelectItem>
                  </SelectContent>
                </Select>
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />
        {/* Phone Number */}
        <FormField
          control={control}
          name="phoneNumber"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Phone Number</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Phone Number"
                  {...field}
                  value={field.value || ''} // Ensure value is never undefined
                  className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
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
