'use client';

import { Input } from '@/components/ui/input';
import { UseFormRegister, FieldErrors } from 'react-hook-form';
import { EditPlayerFormValues } from '@/schemas/Player.schema';

interface AddressSectionProps {
  register: UseFormRegister<EditPlayerFormValues>;
  errors: FieldErrors<EditPlayerFormValues>;
  isEditing: boolean;
  player: EditPlayerFormValues | null;
}

export default function AddressSection({
  register,
  errors,
  isEditing,
  player,
}: AddressSectionProps) {
  return (
    <section className="mb-8">
      <h2 className="text-xl font-semibold mb-4">Mailing Address</h2>
      <div className="rounded-lg border border-gray-200 bg-white p-4 grid grid-cols-2 gap-4">
        {isEditing ? (
          <>
            {/* Street Address */}
            <div>
              <label className="block text-sm font-medium">
                Street Address
              </label>
              <Input
                {...register('playerDetails.streetAddress')}
                className={`w-full p-1 border rounded ${
                  errors?.playerDetails?.streetAddress ? 'border-red-500' : ''
                }`}
              />
              {errors?.playerDetails?.streetAddress && (
                <p className="text-red-500 text-sm">
                  {errors.playerDetails.streetAddress.message as string}
                </p>
              )}
            </div>

            {/* Postal Code */}
            <div>
              <label className="block text-sm font-medium">Postal Code</label>
              <Input
                {...register('playerDetails.postalCode')}
                className={`w-full p-1 border rounded ${
                  errors?.playerDetails?.postalCode ? 'border-red-500' : ''
                }`}
              />
              {errors?.playerDetails?.postalCode && (
                <p className="text-red-500 text-sm">
                  {errors.playerDetails.postalCode.message as string}
                </p>
              )}
            </div>

            {/* Street Address Line 2 */}
            <div>
              <label className="block text-sm font-medium">
                Street Address Line 2
              </label>
              <Input
                {...register('playerDetails.streetAddress2')}
                className="w-full p-1 border rounded"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium">Country</label>
              <Input
                {...register('playerDetails.country')}
                className={`w-full p-1 border rounded ${
                  errors?.playerDetails?.country ? 'border-red-500' : ''
                }`}
              />
              {errors?.playerDetails?.country && (
                <p className="text-red-500 text-sm">
                  {errors.playerDetails.country.message as string}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium">City</label>
              <Input
                {...register('playerDetails.city')}
                className={`w-full p-1 border rounded ${
                  errors?.playerDetails?.city ? 'border-red-500' : ''
                }`}
              />
              {errors?.playerDetails?.city && (
                <p className="text-red-500 text-sm">
                  {errors.playerDetails.city.message as string}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <Input
                {...register('playerDetails.phoneNumber')}
                className={`w-full p-1 border rounded ${
                  errors?.playerDetails?.phoneNumber ? 'border-red-500' : ''
                }`}
              />
              {errors?.playerDetails?.phoneNumber && (
                <p className="text-red-500 text-sm">
                  {errors.playerDetails.phoneNumber.message as string}
                </p>
              )}
            </div>

            {/* State/Province */}
            <div>
              <label className="block text-sm font-medium">
                State/Province
              </label>
              <Input
                {...register('playerDetails.state')}
                className={`w-full p-1 border rounded ${
                  errors?.playerDetails?.state ? 'border-red-500' : ''
                }`}
              />
              {errors?.playerDetails?.state && (
                <p className="text-red-500 text-sm">
                  {errors.playerDetails.state.message as string}
                </p>
              )}
            </div>
          </>
        ) : (
          <>
            {/* Street Address */}
            <div>
              <label className="block text-sm font-medium">
                Street Address
              </label>
              <p>{player?.playerDetails.streetAddress}</p>
            </div>

            {/* Postal Code */}
            <div>
              <label className="block text-sm font-medium">Postal Code</label>
              <p>{player?.playerDetails.postalCode}</p>
            </div>

            {/* Street Address Line 2 */}
            <div>
              <label className="block text-sm font-medium">
                Street Address Line 2
              </label>
              <p>{player?.playerDetails.streetAddress2}</p>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium">Country</label>
              <p>{player?.playerDetails.country}</p>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium">City</label>
              <p>{player?.playerDetails.city}</p>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <p>{player?.playerDetails.phoneNumber}</p>
            </div>

            {/* State/Province */}
            <div>
              <label className="block text-sm font-medium">
                State/Province
              </label>
              <p>{player?.playerDetails.state}</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
