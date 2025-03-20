'use client';
import React, { useEffect, useState } from 'react';
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

import { City, Country, State } from 'country-state-city';
import { playerOnboardingInput } from '@/schemas/Player.schema';
import { renderLabel } from '@/components/RenderLable';
import { FileUploader } from '@/components/FileUploader';

export const PlayerDetailsStepOne = () => {
  // Local state to store countries, states, and cities options
  const [countryOptions, setCountryOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [stateOptions, setStateOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [cityOptions, setCityOptions] = useState<
    { value: string; label: string }[]
  >([]);

  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<playerOnboardingInput>();

  const selectedCountry = watch('country');
  const selectedState = watch('state');
  setValue('countryCode', '+1');

  const handleCountryCodeSelect = (country: string) => {
    setValue('countryCode', '+' + country);
  };

  const handlePhoneNumberChange = (phoneNumber: string) => {
    setValue('phoneNumber', phoneNumber);
  };

  // Load all countries on mount
  useEffect(() => {
    const countries = Country.getAllCountries().map((country) => ({
      value: country.isoCode, // Using ISO code as value
      label: country.name,
    }));
    setCountryOptions(countries);
  }, []);

  // Update states when selected country changes
  useEffect(() => {
    if (selectedCountry) {
      const states = State.getStatesOfCountry(selectedCountry).map((state) => ({
        value: state.isoCode,
        label: state.name,
      }));
      setStateOptions(states);
      // Reset dependent fields when country changes
      setValue('state', '');
      setValue('city', '');
      setCityOptions([]);
    }
  }, [selectedCountry, setValue]);

  // Update cities when selected state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      const cities = City.getCitiesOfState(selectedCountry, selectedState).map(
        (city) => ({
          value: city.name, // or any unique identifier available
          label: city.name,
        })
      );
      setCityOptions(cities);
      // Reset city if state changes
      setValue('city', '');
    }
  }, [selectedState, setValue]);

  return (
    <div className="grid grid-cols-1 items-end gap-4 md:grid-cols-2 lg:grid-cols-2">
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
                <SelectTrigger className="w-full h-[42px] p-3 text-sm border rounded-md focus:ring-2 focus:ring-red-500">
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
              {renderLabel('Street Address', true)}
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Street Address"
                {...field}
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage>{errors.streetAddress?.message}</FormMessage>
          </FormItem>
        )}
      />
      <FormField
        control={control}
        name="streetAddress2"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900">
              {renderLabel('Street Address 2', false)}
            </FormLabel>
            <FormControl>
              <Input
                placeholder="Enter Street Address 2"
                {...field}
                value={field.value ?? ''}
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      {/* Country */}
      <FormField
        control={control}
        name="country"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('Country', true)}</FormLabel>
            <FormControl>
              <Select value={field.value || ''} onValueChange={field.onChange}>
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
            <FormMessage>{errors.country?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* State/Province */}
      <FormField
        control={control}
        name="state"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('State/Province', true)}</FormLabel>
            <FormControl>
              <Select value={field.value || ''} onValueChange={field.onChange}>
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
            <FormMessage>{errors.state?.message}</FormMessage>
          </FormItem>
        )}
      />

      {/* City */}
      <FormField
        control={control}
        name="city"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('City', true)}</FormLabel>
            {cityOptions.length > 0 ? (
              <FormControl>
                <Select
                  value={field.value || ''}
                  onValueChange={field.onChange}
                >
                  <SelectTrigger className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500">
                    <SelectValue placeholder="Select City" />
                  </SelectTrigger>
                  <SelectContent>
                    {cityOptions.map((option) => (
                      <SelectItem key={option.value} value={option.value}>
                        {option.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </FormControl>
            ) : (
              <FormControl>
                <Input
                  placeholder="Enter City"
                  {...field}
                  value={field.value || ''}
                  className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </FormControl>
            )}
            <FormMessage>{errors.city?.message}</FormMessage>
          </FormItem>
        )}
      />

      <FormField
        control={control}
        name="postalCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel className="text-sm text-gray-900">
              {renderLabel('Postal Code', true)}
            </FormLabel>
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
          onCountrySelect={handleCountryCodeSelect}
          onPhoneNumberChange={handlePhoneNumberChange}
          className="w-full"
        />
      </div>

      {/* Age Proof Upload */}
      <div className="space-y-2">
        <FormField
          control={control}
          name="ageProof"
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
