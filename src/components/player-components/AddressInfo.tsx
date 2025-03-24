'use client';

import React, { useEffect, useState } from 'react';
import { Input } from '@/components/ui/input';
import {
  UseFormRegister,
  FieldErrors,
  Control,
  useWatch,
} from 'react-hook-form';
import { EditPlayerFormValues } from '@/schemas/Player.schema';
import { ReactNode } from 'react';
import { Country, State, City } from 'country-state-city';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { PhoneInput } from '@/components/phoneinput';
import * as RPNInput from 'react-phone-number-input';

interface AddressSectionProps {
  register: UseFormRegister<EditPlayerFormValues>;
  errors: FieldErrors<EditPlayerFormValues>;
  isEditing: boolean;
  player: EditPlayerFormValues | null;
  control: Control<EditPlayerFormValues>;
  setValue: (name: any, value: any) => void;
}

export default function AddressSection({
  register,
  errors,
  isEditing,
  player,
  control,
  setValue,
}: AddressSectionProps) {
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

  // Watch for changes in country and state
  const selectedCountry = useWatch({
    control: control!,
    name: 'playerDetails.country',
    defaultValue: player?.playerDetails.country || '',
  });
  // At the beginning of your component, add a debug log
  console.log('isEditing:', isEditing, typeof isEditing);
  const selectedState = useWatch({
    control: control!,
    name: 'playerDetails.state',
    defaultValue: player?.playerDetails.state || '',
  });
  const selectedCity = useWatch({
    control: control!,
    name: 'playerDetails.city',
    defaultValue: player?.playerDetails.city || '',
  });
  const handlePhoneNumberChange = (phoneNumber: string) => {
    setValue('playerDetails.phoneNumber', phoneNumber);
  };

  // Load all countries on mount
  useEffect(() => {
    const countries = Country.getAllCountries().map((country) => ({
      value: country.isoCode,
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

      // Reset dependent fields only if country changes and we're in edit mode
      if (isEditing && selectedCountry !== player?.playerDetails.country) {
        setValue('playerDetails.state', '');
        setValue('playerDetails.city', '');
        setCityOptions([]);
      }
    }
  }, [selectedCountry, setValue, isEditing, player?.playerDetails.country]);

  // Update cities when selected state changes
  useEffect(() => {
    if (selectedCountry && selectedState) {
      const cities = City.getCitiesOfState(selectedCountry, selectedState).map(
        (city) => ({
          value: city.name,
          label: city.name,
        })
      );
      setCityOptions(cities);

      // Reset city if state changes and we're in edit mode
      if (isEditing && selectedState !== player?.playerDetails.state) {
        setValue('playerDetails.city', '');
      }
    }
  }, [
    selectedState,
    selectedCountry,
    setValue,
    isEditing,
    player?.playerDetails.state,
  ]);

  // Helper function to safely convert any value to ReactNode
  const formatFieldValue = (value: any): ReactNode => {
    if (value === null || value === undefined) {
      return '—';
    }

    if (value instanceof Date) {
      return value.toLocaleDateString();
    }

    return String(value);
  };

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Mailing Address</h2>
      <div className="rounded-lg border border-gray-200 bg-white p-4 grid grid-cols-2 gap-4">
        {/* Street Address */}
        <div>
          <label
            className={`block text-sm font-medium ${!isEditing ? 'mb-2' : ''}`}
          >
            Street Address
          </label>
          {isEditing ? (
            <>
              <Input
                {...register('playerDetails.streetAddress')}
                className={`w-full p-1 border rounded ${
                  errors?.playerDetails?.streetAddress ? 'border-red-500' : ''
                }`}
              />
              {errors?.playerDetails?.streetAddress && (
                <p className="text-red-500 text-sm">
                  {errors.playerDetails.streetAddress?.message as string}
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-700">
              {formatFieldValue(player?.playerDetails.streetAddress)}
            </p>
          )}
        </div>

        {/* Postal Code */}
        <div>
          <label
            className={`block text-sm font-medium ${!isEditing ? 'mb-2' : ''}`}
          >
            Postal Code
          </label>
          {isEditing ? (
            <>
              <Input
                {...register('playerDetails.postalCode')}
                type="text"
                className={`w-full p-1 border rounded ${
                  errors?.playerDetails?.postalCode ? 'border-red-500' : ''
                }`}
              />
              {errors?.playerDetails?.postalCode && (
                <p className="text-red-500 text-sm">
                  {errors.playerDetails.postalCode?.message as string}
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-700">
              {formatFieldValue(player?.playerDetails.postalCode)}
            </p>
          )}
        </div>

        {/* Street Address Line 2 */}
        <div>
          <label
            className={`block text-sm font-medium ${!isEditing ? 'mb-2' : ''}`}
          >
            Street Address Line 2
          </label>
          {isEditing ? (
            <>
              <Input
                {...register('playerDetails.streetAddress2')}
                className={`w-full p-1 border rounded ${
                  errors?.playerDetails?.streetAddress2 ? 'border-red-500' : ''
                }`}
              />
              {errors?.playerDetails?.streetAddress2 && (
                <p className="text-red-500 text-sm">
                  {errors.playerDetails.streetAddress2?.message as string}
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-700">
              {formatFieldValue(player?.playerDetails.streetAddress2)}
            </p>
          )}
        </div>

        {/* Country */}
        <div>
          <label
            className={`block text-sm font-medium ${!isEditing ? 'mb-2' : ''}`}
          >
            Country
          </label>
          {isEditing ? (
            <>
              <Select
                value={selectedCountry}
                onValueChange={(value) =>
                  setValue('playerDetails.country', value)
                }
              >
                <SelectTrigger
                  className={`w-full p-1 border rounded ${
                    errors?.playerDetails?.country ? 'border-red-500' : ''
                  }`}
                >
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
              {errors?.playerDetails?.country && (
                <p className="text-red-500 text-sm">
                  {errors.playerDetails.country?.message as string}
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-700">
              {formatFieldValue(
                Country.getCountryByCode(player?.playerDetails.country || '')
                  ?.name || player?.playerDetails.country
              )}
            </p>
          )}
        </div>

        {/* State/Province */}
        <div>
          <label
            className={`block text-sm font-medium ${!isEditing ? 'mb-2' : ''}`}
          >
            State/Province
          </label>
          {isEditing ? (
            <>
              <Select
                value={selectedState}
                onValueChange={(value) =>
                  setValue('playerDetails.state', value)
                }
                disabled={!selectedCountry}
              >
                <SelectTrigger
                  className={`w-full p-1 border rounded ${
                    errors?.playerDetails?.state ? 'border-red-500' : ''
                  }`}
                >
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
              {errors?.playerDetails?.state && (
                <p className="text-red-500 text-sm">
                  {errors.playerDetails.state?.message as string}
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-700">
              {formatFieldValue(
                State.getStateByCodeAndCountry(
                  player?.playerDetails.state || '',
                  player?.playerDetails.country || ''
                )?.name || player?.playerDetails.state
              )}
            </p>
          )}
        </div>

        {/* City */}
        <div>
          <label
            className={`block text-sm font-medium ${!isEditing ? 'mb-2' : ''}`}
          >
            City
          </label>
          {isEditing ? (
            <>
              {cityOptions.length > 0 ? (
                <Select
                  value={selectedCity}
                  onValueChange={(value) =>
                    setValue('playerDetails.city', value)
                  }
                  disabled={!selectedState}
                >
                  <SelectTrigger
                    className={`w-full p-1 border rounded ${
                      errors?.playerDetails?.city ? 'border-red-500' : ''
                    }`}
                  >
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
              ) : (
                <Input
                  {...register('playerDetails.city')}
                  disabled={!selectedState}
                  className={`w-full p-1 border rounded ${
                    errors?.playerDetails?.city ? 'border-red-500' : ''
                  }`}
                />
              )}
              {errors?.playerDetails?.city && (
                <p className="text-red-500 text-sm">
                  {errors.playerDetails.city?.message as string}
                </p>
              )}
            </>
          ) : (
            <p className="text-gray-700">
              {formatFieldValue(player?.playerDetails.city)}
            </p>
          )}
        </div>

        {/* Phone Number */}
        <div>
          {isEditing ? (
            <>
              <PhoneInput
                placeholder="Your phone number"
                defaultCountry={
                  (player?.playerDetails.countryCode?.replace(
                    '+',
                    ''
                  ) as RPNInput.Country) || 'US'
                }
                onPhoneNumberChange={handlePhoneNumberChange}
                className={`w-full ${
                  errors?.playerDetails?.phoneNumber ? 'border-red-500' : ''
                }`}
              />
              {errors?.playerDetails?.phoneNumber && (
                <p className="text-red-500 text-sm">
                  {errors.playerDetails.phoneNumber?.message as string}
                </p>
              )}
            </>
          ) : (
            <>
              <label
                className={`block text-sm font-medium ${!isEditing ? 'mb-2' : ''}`}
              >
                Phone Number
              </label>
              <p className="text-gray-700">
                {formatFieldValue(
                  `${player?.playerDetails.countryCode || ''} ${player?.playerDetails.phoneNumber || ''}`
                )}
              </p>
            </>
          )}
        </div>
      </div>
    </section>
  );
}
