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
  loginSchema,
  LoginFormValues,
} from '../../schemas/form-schemas/loginMemberSchema'; // Zod Validation logic for the component.

// All the imports

// This is a reusable component which is currently being used for two routes.
// 1. login-federation
// 2. login-member

interface LoginProps {
  imageSrc: string;
  heading: string; //Two possble values for now -[Federation, Member].
  signUpHref: string; // Since the signup routes are different for member and federation.
}
// Props for this component --

// The first prop will be an imageSrc and will pass that imageSrc to AuthLayout.
// The second prop will be a string which will be used as a heading.
// The third prop will be a link to the sign up page.

export const Login = ({ imageSrc, heading, signUpHref }: LoginProps) => {
  const router = useRouter(); // Initialize the router

  // React hook form Logic
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  // Function to handle submit
  const onSubmit = (values: LoginFormValues) => {
    console.log('Submitting values:', values);
    // Replace with actual API request
    router.push('/dashboard');
    // On Successful Validation, Push to the dashboard page.
  };

  return (
    // Pass the image you accepted as prop to AuthLayout.
    <AuthLayout imageSrc={imageSrc}>
      <Logo />
      {/* Global Logo component */}

      <div className="m-20">
        {/* Container Div */}

        <h1 className="flex justify-center text-2xl m-5 ">{heading} Login</h1>
        {/* Pass the heading string you accepted as a prop above */}

        <h1 className="flex justify-center text-3xl m-5 font-bold">
          Hello Again!
        </h1>
        <p className="text-center text-gray-600 mb-3 text-sm">
          Connect Effortlessly, Control Securely, Collaborate Seamlessly Across
          Federated Networks
        </p>

        {/* The below is the form-logic for member login */}
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-3">
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel className="text-input-grey">
                    Email Address
                  </FormLabel>
                  <FormControl>
                    <Input
                      placeholder="Email Address"
                      {...field}
                      aria-label="Email"
                      className="w-full"
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
                      className="w-full"
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-primary underline">
                Forgot Password?
              </Link>
            </div>
            <Button
              type="submit"
              className="w-full font-extrabold bg-primary hover:bg-red-400"
            >
              Login
            </Button>
          </form>
        </Form>

        {/* Pass the signUpHref below */}

        <div className="mt-5 flex justify-center">
          Don’t have an account?{' '}
          <Link href={signUpHref} className="text-primary ml-2 underline">
            Sign up here
          </Link>
        </div>
      </div>
    </AuthLayout>
  );
};

export default Login;
