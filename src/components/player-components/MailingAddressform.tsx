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
import { CreatePlayerFormValues } from '@/schemas/player.schema';

export default function MailingAddressForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext<CreatePlayerFormValues>();

  const countryOptions = [
    { value: 'United States', label: 'United States' },
    { value: 'Canada', label: 'Canada' },
    { value: 'Mexico', label: 'Mexico' },
  ];

  const stateOptions = [
    { value: 'AL', label: 'Alabama' },
    { value: 'AK', label: 'Alaska' },
    { value: 'AZ', label: 'Arizona' },
    { value: 'AR', label: 'Arkansas' },
    { value: 'CA', label: 'California' },
  ];

  const renderLabel = (text: string, isRequired: boolean = false) => (
    <>
      <span className="text-sm text-gray-900">{text}</span>
      {isRequired && <span className="text-red-500"> *</span>}
    </>
  );

  return (
    <div className="space-y-6 max-w-3xl mx-auto bg-white p-6 rounded-lg">
      <h3 className="text-xl font-semibold text-gray-900 mb-4">
        Mailing Address
      </h3>

      {/* Street Address */}
      <FormField
        control={control}
        name="playerDetails.streetAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('Street Address', true)}</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Street Address"
                {...field}
                value={field.value || ''} // Ensure value is never undefined
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage>
              {errors.playerDetails?.streetAddress?.message}
            </FormMessage>
          </FormItem>
        )}
      />

      {/* Street Address Line 2 */}
      <FormField
        control={control}
        name="playerDetails.streetAddress2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('Street Address Line 2')}</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Address Line 2"
                {...field}
                value={field.value || ''} // Ensure value is never undefined
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage>
              {errors.playerDetails?.streetAddress2?.message}
            </FormMessage>
          </FormItem>
        )}
      />

      {/* Country */}
      <FormField
        control={control}
        name="playerDetails.country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('Country', true)}</FormLabel>
            <FormControl>
              <Select
                value={field.value || ''} // Ensure value is never undefined
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500">
                  <SelectValue placeholder="Select Country" />
                </SelectTrigger>
                <SelectContent>
                  {countryOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage>{errors.playerDetails?.country?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* State/Province */}
      <FormField
        control={control}
        name="playerDetails.state"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('State/Province', true)}</FormLabel>
            <FormControl>
              <Select
                value={field.value || ''} // Ensure value is never undefined
                onValueChange={field.onChange}
              >
                <SelectTrigger className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500">
                  <SelectValue placeholder="Select State/Province" />
                </SelectTrigger>
                <SelectContent>
                  {stateOptions.map((option) => (
                    <SelectItem key={option.value} value={option.value}>
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </FormControl>
            <FormMessage>{errors.playerDetails?.state?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* City */}
      <FormField
        control={control}
        name="playerDetails.city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('City', true)}</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter City"
                {...field}
                value={field.value || ''} // Ensure value is never undefined
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage>{errors.playerDetails?.city?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Postal Code */}
      <FormField
        control={control}
        name="playerDetails.postalCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('Postal Code', true)}</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Postal Code"
                {...field}
                value={field.value || ''} // Ensure value is never undefined
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage>
              {errors.playerDetails?.postalCode?.message}
            </FormMessage>
          </FormItem>
        )}
      />

      {/* Phone Number */}
      <FormField
        control={control}
        name="playerDetails.phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('Phone Number', true)}</FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Phone Number"
                {...field}
                value={field.value || ''} // Ensure value is never undefined
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage>
              {errors.playerDetails?.phoneNumber?.message}
            </FormMessage>
          </FormItem>
        )}
      />
    </div>
  );
}
