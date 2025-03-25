'use client';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Country, State, City } from 'country-state-city';
import { renderLabel } from '@/components/RenderLabel';
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
import { PhoneInput } from '@/components/phoneinput';

export const ParentOnboardingForm = () => {
  const { control, setValue, watch } = useFormContext();

  // Local state to store options for country, state, and city
  const [countryOptions, setCountryOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [stateOptions, setStateOptions] = useState<
    { value: string; label: string }[]
  >([]);
  const [cityOptions, setCityOptions] = useState<
    { value: string; label: string }[]
  >([]);

  // Set a default phone country code on mount
  useEffect(() => {
    setValue('countryCode', '+1');
  }, [setValue]);

  // Watch for selected country and state to update dependent selects
  const selectedCountry = watch('country');
  const selectedState = watch('state');

  // Load countries on mount
  useEffect(() => {
    const countries = Country.getAllCountries().map((country) => ({
      value: country.isoCode, // using ISO code as the value
      label: country.name,
    }));
    setCountryOptions(countries);
  }, []);

  // Update state options when the selected country changes
  useEffect(() => {
    if (selectedCountry) {
      const states = State.getStatesOfCountry(selectedCountry).map((state) => ({
        value: state.isoCode,
        label: state.name,
      }));
      setStateOptions(states);
      // Reset state and city when country changes
      setValue('state', '');
      setValue('city', '');
      setCityOptions([]);
    }
  }, [selectedCountry, setValue]);

  // Update city options when the selected state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      const cities = City.getCitiesOfState(selectedCountry, selectedState).map(
        (city) => ({
          value: city.name,
          label: city.name,
        })
      );
      setCityOptions(cities);
      // Reset city when state changes
      setValue('city', '');
    }
  }, [selectedState, setValue]);

  const handleCountrySelect = (country: string) => {
    setValue('countryCode', '+' + country);
  };

  const handlePhoneNumberChange = (phoneNumber: string) => {
    setValue('phoneNumber', phoneNumber);
  };

  return (
    <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-2">
      {/* Street Address */}
      <FormField
        control={control}
        name="streetAddress"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('Street Address', true)}</FormLabel>
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

      {/* Street Address 2 */}
      <FormField
        control={control}
        name="streetAddress2"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('Street Address 2')}</FormLabel>
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

      {/* Country Select */}
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
            <FormMessage />
          </FormItem>
        )}
      />

      {/* State/Province Select */}
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
            <FormMessage />
          </FormItem>
        )}
      />

      {/* City Select or Input */}
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
                  className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
                />
              </FormControl>
            )}
            <FormMessage />
          </FormItem>
        )}
      />

      {/* Postal Code */}
      <FormField
        control={control}
        name="postalCode"
        render={({ field }) => (
          <FormItem>
            <FormLabel>{renderLabel('Postal Code', true)}</FormLabel>
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

      {/* Phone Input */}
      <div className="flex gap-x-5 col-span-2">
        <PhoneInput
          placeholder="Your phone number"
          defaultCountry="US"
          onCountrySelect={handleCountrySelect}
          onPhoneNumberChange={handlePhoneNumberChange}
          className="w-full"
        />
      </div>
    </div>
  );
};
