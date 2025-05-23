'use client';

import { redirect } from 'next/navigation'; // Import useRouter
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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Logo } from '@/components/Logo';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';

import { trpc } from '@/hooks/trpcProvider';

import { useEffect } from 'react';
import {
  SignupMemberFormValues,
  signupMemberSchema,
} from '@/schemas/Player.schema';
import { PasswordInput } from '@/components/PasswordInput';
import { signIn } from 'next-auth/react';

// All the imports
// This component is being used for 1 route as of now - /sign-up

interface SignupProps {
  imageSrc: string;
}
//Props for this component

// The component will accept an image as a prop and will pass that image to AuthLayout.
export const SignupMember = ({ imageSrc }: SignupProps) => {
  const { mutate, isLoading } = trpc.auth.signup.useMutation();
  //React hook form Logic
  const form = useForm<SignupMemberFormValues>({
    resolver: zodResolver(signupMemberSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'PLAYER',
      domain: '',
    },
  });

  // Function to handle submit
  const onSubmit = (values: SignupMemberFormValues) => {
    mutate(values, {
      onSuccess: async () => {
        // Make the onSuccess callback async
        const signInResult = await signIn('credentials', {
          email: values.email,
          password: values.password,
          domain: values.domain,
          redirect: false, // Prevent default redirect
        });

        if (signInResult?.error === null) {
          // Check role and redirect accordingly
          if (values.role === 'PARENT') {
            redirect('/players/onboard-parent');
          } else {
            redirect('/players/onboard-player');
          }
        } else {
          console.error('Sign In Error:', signInResult?.error);
        }
      },
      onError: (error: any) => {
        console.error('Error:', error);
      },
    });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Access the current URL using the window object
      form.setValue('domain', window.location.host);
    }
  }, []);
  return (
    // Pass the image you accepted as prop to AuthLayout.
    <AuthLayout imageSrc={imageSrc}>
      <Logo path="/login" />
      {/* Global Logo component */}

      <div className="m-auto max-w-xl w-full">
        {/* Container Div */}
        <h1 className="flex justify-center text-2xl m-8 font-bold">
          Member Sign Up
        </h1>
        <fieldset disabled={isLoading} className="p6">
          {/* The below is the form-logic for the onboarding-federation */}
          <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-input-grey">
                      First name
                    </FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your first name"
                        {...field}
                        aria-label="First Name"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage /> {/* Error message should go here */}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="lastName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-input-grey">Last name</FormLabel>
                    <FormControl>
                      <Input
                        placeholder="Enter your last name"
                        {...field}
                        aria-label="Last Name"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage /> {/* Error message should go here */}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-input-grey">Email</FormLabel>
                    <FormControl>
                      <Input
                        type="email"
                        placeholder="Email Address"
                        {...field}
                        aria-label="Email"
                        className="w-full"
                      />
                    </FormControl>
                    <FormMessage /> {/* Error message should go here */}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="password"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-input-grey">Password</FormLabel>
                    <PasswordInput field={field} />
                    <FormMessage /> {/* Error message should go here */}
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="role"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-input-grey">Role</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select a role" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="PLAYER">Player</SelectItem>

                          <SelectItem value="PARENT">Parent</SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage /> {/* Error message should go here */}
                  </FormItem>
                )}
              />

              <Button type="submit" className="w-full font-extrabold">
                Create My Account
              </Button>
            </form>
          </Form>
        </fieldset>
        <div className="mt-5 flex justify-center">
          Already have an account?{' '}
          <Link href="/login" className="text-primary ml-2 underline">
            Login here
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignupMember;
