'use client';
import React, { useEffect, useState } from 'react';
import { useFormContext } from 'react-hook-form';
import { Country, State, City } from 'country-state-city';

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
import { CreatePlayerFormValues } from '@/schemas/Player.schema';
import { PhoneInput } from '@/components/phoneinput';

export default function MailingAddressForm() {
  const {
    control,
    setValue,
    watch,
    formState: { errors },
  } = useFormContext<CreatePlayerFormValues>();

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
  const handleCountrySelect = (country: string) => {
    setValue('playerDetails.countryCode', '+' + country);
  };

  const handlePhoneNumberChange = (phoneNumber: string) => {
    setValue('playerDetails.phoneNumber', phoneNumber);
  };

  // Watch country and state values to update the dependent select inputs
  const selectedCountry = watch('playerDetails.country');
  const selectedState = watch('playerDetails.state');

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
      setValue('playerDetails.state', '');
      setValue('playerDetails.city', '');
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
      setValue('playerDetails.city', '');
    }
  }, [selectedState, setValue]);

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
                value={field.value || ''}
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
                value={field.value || ''}
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
                type="number"
                {...field}
                value={field.value || ''}
                className="w-full p-3 text-base border rounded-lg focus:ring-2 focus:ring-red-500"
              />
            </FormControl>
            <FormMessage>
              {errors.playerDetails?.postalCode?.message}
            </FormMessage>
          </FormItem>
        )}
      />

      <div className="flex gap-x-5">
        <PhoneInput
          placeholder="Your phone number"
          defaultCountry="US"
          onCountrySelect={handleCountrySelect}
          onPhoneNumberChange={handlePhoneNumberChange}
        />
      </div>
    </div>
  );
}
