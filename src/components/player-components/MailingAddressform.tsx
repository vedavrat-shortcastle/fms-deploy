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
import { AddPlayerFormData } from '@/schemas/addplayer.schema';

export default function MailingAddressForm() {
  const {
    control,
    formState: { errors },
  } = useFormContext<AddPlayerFormData>();

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
      {text}
      {isRequired && <span className="text-red-500"> *</span>}
    </>
  );

  return (
    <div className="space-y-6">
      <h3 className="text-xl font-semibold text-gray-700 mb-4">
        Mailing Address
      </h3>

      {/* Street Address */}
      <FormField
        control={control}
        name="mailing.streetAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('Street Address', true)}</FormLabel>
            <FormControl>
              <Input placeholder="Enter Street Address" {...field} />
            </FormControl>
            <FormMessage>{errors.mailing?.streetAddress?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Street Address Line 2 */}
      <FormField
        control={control}
        name="mailing.streetAddressLine2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Street Address Line 2</FormLabel>
            <FormControl>
              <Input placeholder="Enter Address Line 2" {...field} />
            </FormControl>
            <FormMessage>
              {errors.mailing?.streetAddressLine2?.message}
            </FormMessage>
          </FormItem>
        )}
      />

      {/* Country */}
      <FormField
        control={control}
        name="mailing.country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('Country', true)}</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
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
            <FormMessage>{errors.mailing?.country?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* State/Province */}
      <FormField
        control={control}
        name="mailing.state"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('State/Province', true)}</FormLabel>
            <FormControl>
              <Select value={field.value} onValueChange={field.onChange}>
                <SelectTrigger>
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
            <FormMessage>{errors.mailing?.state?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* City */}
      <FormField
        control={control}
        name="mailing.city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('City', true)}</FormLabel>
            <FormControl>
              <Input placeholder="Enter City" {...field} />
            </FormControl>
            <FormMessage>{errors.mailing?.city?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Postal Code */}
      <FormField
        control={control}
        name="mailing.postalCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('Postal Code', true)}</FormLabel>
            <FormControl>
              <Input placeholder="Enter Postal Code" {...field} />
            </FormControl>
            <FormMessage>{errors.mailing?.postalCode?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* Phone Number */}
      <FormField
        control={control}
        name="mailing.phoneNumber"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('Phone Number')}</FormLabel>
            <FormControl>
              <Input placeholder="Enter Phone Number" {...field} />
            </FormControl>
            <FormMessage>{errors.mailing?.phoneNumber?.message}</FormMessage>
          </FormItem>
        )}
      />
    </div>
  );
}
