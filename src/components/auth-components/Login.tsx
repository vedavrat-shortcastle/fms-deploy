'use client';

import { useRouter } from 'next/navigation'; // Import useRouter
import { signIn } from 'next-auth/react';
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

import { useEffect, useState } from 'react';
import { LoginFormValues, loginSchema } from '@/schemas/LoginSchema';
import { PasswordInput } from '@/components/PasswordInput';

// All the imports

interface LoginProps {
  imageSrc: string;
  heading: string; //Two possble values for now -[Federation, Member].
  signUpHref?: string; // Since the signup routes are different for member and federation.
}
// Props for this component --

// The first prop will be an imageSrc and will pass that imageSrc to AuthLayout.
// The second prop will be a string which will be used as a heading.
// The third prop will be a link to the sign up page.

export const Login = ({ imageSrc, heading, signUpHref }: LoginProps) => {
  const router = useRouter(); // Initialize the router
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // React hook form Logic
  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
      domain: '',
    },
  });

  // Function to handle submit
  const onSubmit = async (values: LoginFormValues) => {
    setError(null);
    setLoading(true);
    try {
      const result = await signIn('credentials', {
        email: values.email,
        password: values.password,
        domain: values.domain,
        redirect: false,
      });

      if (result?.error) {
        setError('Invalid credentials - No Account found');
        return;
      }

      if (result?.ok) {
        router.push('/players');
      }
    } catch (error) {
      console.error(error);
      setError('An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
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

      <div className="mt-40">
        {/* Container Div */}
        {error && (
          <div className="text-primary text-md text-center mt-2">{error}</div>
        )}

        <h1 className="flex justify-center text-2xl">{heading} Login</h1>
        {/* Pass the heading string you accepted as a prop above */}

        <h1 className="flex justify-center text-3xl m-5 font-bold">
          Hello Again!
        </h1>
        <p className="text-center text-gray-600 mb-3 text-sm">
          Connect Effortlessly, Control Securely, Collaborate Seamlessly Across
          Federated Networks
        </p>

        {/* The below is the form-logic for login */}
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
            <div className="flex justify-end">
              <Link href="/forgot-password" className="text-primary underline">
                Forgot Password?
              </Link>
            </div>
            <Button
              type="submit"
              disabled={loading}
              className="w-full font-extrabold bg-primary hover:bg-red-400"
            >
              {loading ? 'Logging in...' : 'Login'}
            </Button>
          </form>
        </Form>

        {/* Pass the signUpHref below */}

        {signUpHref && (
          <div className="mt-5 flex justify-center">
            Don’t have an account?{' '}
            <Link href={signUpHref} className="text-primary ml-2 underline">
              Sign up here
            </Link>
          </div>
        )}
      </div>
    </AuthLayout>
  );
};

export default Login;
