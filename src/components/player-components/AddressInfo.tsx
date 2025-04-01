'use client';

import React from 'react';
import {
  FieldErrors,
  Control,
  useWatch,
  UseFormRegister,
} from 'react-hook-form';
import { EditPlayerFormValues } from '@/schemas/Player.schema';
import { Input } from '@/components/ui/input';
import { Country, State } from 'country-state-city';
import LocationSelect from '@/components/player-components/LocationSelect';
import { useLocationData } from '@/hooks/useLocation';
import { PhoneInput } from '@/components/PhoneInput';
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
  const selectedCountry = useWatch({
    control,
    name: 'playerDetails.country',
    defaultValue: player?.playerDetails.country || '',
  });
  const selectedState = useWatch({
    control,
    name: 'playerDetails.state',
    defaultValue: player?.playerDetails.state || '',
  });
  const selectedCity = useWatch({
    control,
    name: 'playerDetails.city',
    defaultValue: player?.playerDetails.city || '',
  });

  const { countryOptions, stateOptions, cityOptions } = useLocationData(
    selectedCountry,
    selectedState
  );

  const handlePhoneNumberChange = (phoneNumber: string) => {
    setValue('playerDetails.phoneNumber', phoneNumber);
  };

  // Helper function for formatting fields in view mode
  const formatFieldValue = (value: any): React.ReactNode => {
    if (value === null || value === undefined) return '—';
    if (value instanceof Date) return value.toLocaleDateString();
    return String(value);
  };

  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Mailing Address</h2>
      <div className="rounded-lg border border-gray-200 bg-white p-4 grid grid-cols-2 gap-4">
        {/* Street Address */}
        <div>
          <label className="block text-sm font-medium">Street Address</label>
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
          <label className="block text-sm font-medium">Postal Code</label>
          {isEditing ? (
            <>
              <Input
                {...register('playerDetails.postalCode')}
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
          <label className="block text-sm font-medium">
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

        {/* Country Selector */}
        <div>
          <label className="block text-sm font-medium">Country</label>
          {isEditing ? (
            <>
              <LocationSelect
                value={selectedCountry}
                onChange={(value) => setValue('playerDetails.country', value)}
                options={countryOptions}
                placeholder="Select Country"
                error={errors?.playerDetails?.country?.message as string}
              />
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

        {/* State/Province Selector */}
        <div>
          <label className="block text-sm font-medium">State/Province</label>
          {isEditing ? (
            <>
              <LocationSelect
                value={selectedState}
                onChange={(value) => setValue('playerDetails.state', value)}
                options={stateOptions}
                placeholder="Select State/Province"
                error={errors?.playerDetails?.state?.message as string}
                disabled={!selectedCountry}
              />
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

        {/* City Selector */}
        <div>
          <label className="block text-sm font-medium">City</label>
          {isEditing ? (
            <>
              {cityOptions.length > 0 ? (
                <LocationSelect
                  value={selectedCity}
                  onChange={(value) => setValue('playerDetails.city', value)}
                  options={cityOptions}
                  placeholder="Select City"
                  error={errors?.playerDetails?.city?.message as string}
                  disabled={!selectedState}
                />
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
                defaultValue={player?.playerDetails.phoneNumber || ''}
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
              <label className="block text-sm font-medium">Phone Number</label>
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
