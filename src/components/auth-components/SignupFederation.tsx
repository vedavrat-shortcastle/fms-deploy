'use client';

import { useRouter } from 'next/navigation'; // Import useRouter
import Link from 'next/link';
import { AuthLayout } from '@/components/layouts/AuthLayout';
import { Button } from '@/components/ui/button';
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
  signupFederationSchema,
  SignupFederationFormValues,
} from '../../schemas/form-schemas/signupFederationSchema';

// All the imports

interface SignupProps {
  imageSrc: string;
}
//Props for this component

// The component will accept an image as a prop and will pass that image to AuthLayout.
export const SignupFederation = ({ imageSrc }: SignupProps) => {
  const router = useRouter(); // Initialize the router

  //React hook form Logic
  const form = useForm<SignupFederationFormValues>({
    resolver: zodResolver(signupFederationSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  // Function to handle submit
  const onSubmit = (values: SignupFederationFormValues) => {
    console.log('Submitting values:', values);
    //Replace with actual API request
    router.push('/login-federation');
    // On Successful Validation, Push to the login page.
  };

  return (
    // Pass the image you accepted as prop to AuthLayout.
    <AuthLayout imageSrc={imageSrc}>
      <Logo />
      {/* Global Logo component */}

      <div className="m-40">
        {/* Container Div */}
        <h1 className="flex justify-center text-4xl m-10 font-bold">
          Federation Sign Up
        </h1>

        {/* The below is the form-logic for the signup-federation */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-input-grey">Email</FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email Address"
                      {...field}
                      aria-label="Email"
                      className="w-[450px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-input-grey">Password</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      aria-label="Password"
                      className="w-[450px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-input-grey">
                    Confirm Password
                  </FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      placeholder="Enter your password"
                      {...field}
                      aria-label="Confirm Password"
                      className="w-[450px]"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button type="submit" className="w-full font-extrabold">
              Sign up
            </Button>
          </form>
        </Form>
        <div className="mt-5 flex justify-center">
          Already have an account?{' '}
          <Link
            href="/login-federation"
            className="text-primary ml-2 underline"
          >
            Login here
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignupFederation;
