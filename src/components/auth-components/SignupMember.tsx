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
import {
  signupMemberSchema,
  SignupMemberFormValues,
} from '../../schemas/form-schemas/signupMemberSchema'; // Zod Validation logic for the component.

// All the imports
// This component is being used for 1 route as of now - /sign-up-member

interface SignupProps {
  imageSrc: string;
}
//Props for this component

// The component will accept an image as a prop and will pass that image to AuthLayout.
export const SignupMember = ({ imageSrc }: SignupProps) => {
  const router = useRouter(); // Initialize the router

  //React hook form Logic
  const form = useForm<SignupMemberFormValues>({
    resolver: zodResolver(signupMemberSchema),
    defaultValues: {
      email: '',
      password: '',
      confirmPassword: '',
      role: 'User',
    },
  });

  // Function to handle submit
  const onSubmit = (values: SignupMemberFormValues) => {
    console.log('Submitting values:', values);
    // Replace with actual API request
    router.push('/login-member');
    // On Successful Validation, Push to the login page.
  };

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

        {/* The below is the form-logic for the onboarding-federation */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
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
                        <SelectItem value="User">User</SelectItem>
                        <SelectItem value="Admin">Admin</SelectItem>
                        <SelectItem value="Editor">Editor</SelectItem>
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
