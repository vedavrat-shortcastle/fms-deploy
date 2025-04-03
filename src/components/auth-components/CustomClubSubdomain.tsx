'use client';

import { useRouter, useSearchParams } from 'next/navigation';
import { Suspense, useState, useEffect } from 'react';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Logo } from '@/components/Logo';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import {
  ClubOnboardingFormValues,
  clubOnboardingSchema,
} from '@/schemas/Club.schema';
import { AppRouterInstance } from 'next/dist/shared/lib/app-router-context.shared-runtime';

// Import Country and State from the country-state-city library
import { Country, State, City } from 'country-state-city';
import Loader from '@/components/Loader';
import { trpc } from '@/hooks/trpcProvider';

interface CustomClubSubdomainProps {
  imageSrc: string;
}

export const CustomClubSubdomain = ({ imageSrc }: CustomClubSubdomainProps) => {
  const router = useRouter();

  return (
    <AuthLayout imageSrc={imageSrc}>
      <Logo path="/onboarding-club" />
      <div className="mx-auto mt-16 p-10 max-w-xl w-full">
        <Suspense fallback={<Loader />}>
          <CustomClubSubdomainForm router={router} />
        </Suspense>
      </div>
    </AuthLayout>
  );
};

const CustomClubSubdomainForm = ({ router }: { router: AppRouterInstance }) => {
  const searchParams = useSearchParams();
  const mutation = trpc.club.clubOnboarding.useMutation();

  // Retrieve and parse query data
  const queryData = searchParams ? searchParams.get('data') : null;
  let onboardingData = {};
  if (queryData) {
    try {
      onboardingData = JSON.parse(decodeURIComponent(queryData));
    } catch (e) {
      console.error('Error parsing query data', e);
      router.push('/onboarding-club');
    }
  } else {
    router.push('/onboarding-club');
  }
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

  // React Hook Form setup
  const form = useForm<ClubOnboardingFormValues>({
    resolver: zodResolver(
      clubOnboardingSchema.pick({
        name: true,
        streetAddress: true,
        streetAddress2: true,
        country: true,
        state: true,
        city: true,
        postalCode: true,
        domain: true,
      })
    ),
    defaultValues: {
      name: '',
      streetAddress: '',
      streetAddress2: '',
      country: '',
      state: '',
      city: '',
      postalCode: '',
      domain: '',
    },
  });

  // Watch for selected country and state to update dependent selects
  const selectedCountry = form.watch('country');
  const selectedState = form.watch('state');

  // In CustomClubSubdomainForm component, modify the onSubmit function:
  const onSubmit = async (values: ClubOnboardingFormValues) => {
    // Ensure onboardingData is properly parsed from URL query
    const finalData = {
      ...onboardingData, // Personal details from first form
      ...values, // Club details from current form
    };
    try {
      await mutation.mutateAsync(finalData);
      router.push('/onboarding-welcome');
    } catch (error: unknown) {
      const errorMessage =
        error instanceof Error ? error.message : 'Unknown error occurred';
      console.error(errorMessage);
      alert(errorMessage);
    }
  };
  // Load country options on component mount
  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Access the current URL using the window object
      form.setValue('domain', window.location.host);
    }

    const countries = Country.getAllCountries().map((country) => ({
      value: country.isoCode, // Use ISO code as value
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
      form.setValue('state', '');
      form.setValue('city', '');
      setCityOptions([]);
    }
  }, [selectedCountry, form.setValue]);

  // Update city options when the selected state changes
  useEffect(() => {
    if (selectedState) {
      const cities = City.getCitiesOfState(selectedCountry, selectedState).map(
        (city) => ({
          value: city.name,
          label: city.name,
        })
      );
      setCityOptions(cities);
      // Reset city when state changes
      form.setValue('city', '');
    }
  }, [selectedState, form.setValue]);

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
        <h2 className="text-2xl font-semibold pt-2">Club details</h2>

        {/* Club Name Field */}
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-input-grey">Club Name</FormLabel>
              <FormControl>
                <Input placeholder="Club name" className="w-full" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Street Address */}
        <FormField
          control={form.control}
          name="streetAddress"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-input-grey">Street Address</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Street Address"
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Street Address 2 */}
        <FormField
          control={form.control}
          name="streetAddress2"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-input-grey">
                Street Address 2
              </FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Street Address 2"
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Country Select */}
        <FormField
          control={form.control}
          name="country"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-input-grey">Country</FormLabel>
              <FormControl>
                <Select
                  value={field.value || ''}
                  onValueChange={field.onChange}
                >
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
              <FormMessage />
            </FormItem>
          )}
        />

        {/* State/Province Select */}
        <FormField
          control={form.control}
          name="state"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-input-grey">State/Province</FormLabel>
              <FormControl>
                <Select
                  value={field.value || ''}
                  onValueChange={field.onChange}
                >
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
              <FormMessage />
            </FormItem>
          )}
        />

        {/* City Select or Input */}
        <FormField
          control={form.control}
          name="city"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-input-grey">City</FormLabel>
              {cityOptions.length > 0 ? (
                <FormControl>
                  <Select
                    value={field.value || ''}
                    onValueChange={field.onChange}
                  >
                    <SelectTrigger>
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
                    className="w-full"
                  />
                </FormControl>
              )}
              <FormMessage />
            </FormItem>
          )}
        />

        {/* Postal Code */}
        <FormField
          control={form.control}
          name="postalCode"
          render={({ field }) => (
            <FormItem>
              <FormLabel className="text-input-grey">Postal Code</FormLabel>
              <FormControl>
                <Input
                  placeholder="Enter Postal Code"
                  {...field}
                  className="w-full"
                />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <Button type="submit" className="w-full bg-primary text-black">
          Next →
        </Button>
      </form>
    </Form>
  );
};

export default CustomClubSubdomain;
