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

import { Gender } from '@prisma/client';
import { trpc } from '@/hooks/trpcProvider';

import { useEffect } from 'react';
import {
  SignupMemberFormValues,
  signupMemberSchema,
} from '@/schemas/player.schema';

// All the imports
// This component is being used for 1 route as of now - /sign-up-member

interface SignupProps {
  imageSrc: string;
}
//Props for this component

// The component will accept an image as a prop and will pass that image to AuthLayout.
export const SignupMember = ({ imageSrc }: SignupProps) => {
  const router = useRouter(); // Initialize the router

  const { mutate, isLoading } = trpc.player.signup.useMutation();
  //React hook form Logic
  const form = useForm<SignupMemberFormValues>({
    resolver: zodResolver(signupMemberSchema),
    defaultValues: {
      email: '',
      password: '',
      firstName: '',
      lastName: '',
      role: 'PLAYER',
      gender: 'MALE',
      domain: '',
    },
  });

  // Function to handle submit
  const onSubmit = (values: SignupMemberFormValues) => {
    mutate(values, {
      onSuccess: () => {
        router.push('/login-member');
      },
      onError: (error) => {
        console.error('Error:', error);
      },
    });
  };

  useEffect(() => {
    if (typeof window !== 'undefined') {
      // Access the current URL using the window object
      form.setValue('domain', window.location.origin);
    }
  }, []);
  return (
    // Pass the image you accepted as prop to AuthLayout.
    <AuthLayout imageSrc={imageSrc}>
      <Logo />
      {/* Global Logo component */}

      <div className="m-auto">
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
                        className="w-[350px]"
                      />
                    </FormControl>
                    <FormMessage />
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
                        className="w-[350px]"
                      />
                    </FormControl>
                    <FormMessage />
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
                        className="w-[350px]"
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
                        className="w-[350px]"
                      />
                    </FormControl>
                    <FormMessage />
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
                          <SelectItem value="CLUB_MANAGER">
                            Club Manager
                          </SelectItem>
                        </SelectContent>
                      </Select>
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="gender"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel className="text-input-grey">Gender</FormLabel>
                    <FormControl>
                      <Select
                        onValueChange={field.onChange}
                        defaultValue={field.value}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select your gender" />
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
              <Button type="submit" className="w-full font-extrabold">
                Create My Account
              </Button>
            </form>
          </Form>
        </fieldset>
        <div className="mt-5 flex justify-center">
          Already have an account?{' '}
          <Link href="/login-member" className="text-primary ml-2 underline">
            Login here
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default SignupMember;
