import { Input } from '@/components/ui/input';
import { UseFormRegister, FieldErrors } from 'react-hook-form';

interface AddressSectionProps {
  register: UseFormRegister<PlayerFormData>;
  errors: FieldErrors<PlayerFormData>;
  isEditing: boolean;
  player: Player;
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
                {...register('address.street')}
                className={`w-full p-1 border rounded ${
                  errors.address?.street ? 'border-red-500' : ''
                }`}
              />
              {errors.address?.street && (
                <p className="text-red-500 text-sm">
                  {errors.address.street.message}
                </p>
              )}
            </div>

            {/* Postal Code */}
            <div>
              <label className="block text-sm font-medium">Postal Code</label>
              <Input
                {...register('address.postalCode')}
                className={`w-full p-1 border rounded ${
                  errors.address?.postalCode ? 'border-red-500' : ''
                }`}
              />
              {errors.address?.postalCode && (
                <p className="text-red-500 text-sm">
                  {errors.address.postalCode.message}
                </p>
              )}
            </div>

            {/* Street Address Line 2 */}
            <div>
              <label className="block text-sm font-medium">
                Street Address Line 2
              </label>
              <Input
                {...register('address.street2')}
                className="w-full p-1 border rounded"
              />
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium">Country</label>
              <Input
                {...register('address.country')}
                className={`w-full p-1 border rounded ${
                  errors.address?.country ? 'border-red-500' : ''
                }`}
              />
              {errors.address?.country && (
                <p className="text-red-500 text-sm">
                  {errors.address.country.message}
                </p>
              )}
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium">City</label>
              <Input
                {...register('address.city')}
                className={`w-full p-1 border rounded ${
                  errors.address?.city ? 'border-red-500' : ''
                }`}
              />
              {errors.address?.city && (
                <p className="text-red-500 text-sm">
                  {errors.address.city.message}
                </p>
              )}
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <Input
                {...register('address.phone')}
                className={`w-full p-1 border rounded ${
                  errors.address?.phone ? 'border-red-500' : ''
                }`}
              />
              {errors.address?.phone && (
                <p className="text-red-500 text-sm">
                  {errors.address.phone.message}
                </p>
              )}
            </div>

            {/* State/Province */}
            <div>
              <label className="block text-sm font-medium">
                State/Province
              </label>
              <Input
                {...register('address.state')}
                className={`w-full p-1 border rounded ${
                  errors.address?.state ? 'border-red-500' : ''
                }`}
              />
              {errors.address?.state && (
                <p className="text-red-500 text-sm">
                  {errors.address.state.message}
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
              <p>{player.address.street}</p>
            </div>

            {/* Postal Code */}
            <div>
              <label className="block text-sm font-medium">Postal Code</label>
              <p>{player.address.postalCode}</p>
            </div>

            {/* Street Address Line 2 */}
            <div>
              <label className="block text-sm font-medium">
                Street Address Line 2
              </label>
              <p>{player.address.street2}</p>
            </div>

            {/* Country */}
            <div>
              <label className="block text-sm font-medium">Country</label>
              <p>{player.address.country}</p>
            </div>

            {/* City */}
            <div>
              <label className="block text-sm font-medium">City</label>
              <p>{player.address.city}</p>
            </div>

            {/* Phone Number */}
            <div>
              <label className="block text-sm font-medium">Phone Number</label>
              <p>{player.address.phone}</p>
            </div>

            {/* State/Province */}
            <div>
              <label className="block text-sm font-medium">
                State/Province
              </label>
              <p>{player.address.state}</p>
            </div>
          </>
        )}
      </div>
    </section>
  );
}
