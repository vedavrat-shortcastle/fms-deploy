import { SignupFederation } from '@/components/auth-components/SignupFederation';

// All the Signup/Login/Onboarding components are in auth-components inside components folder.

export default function page() {
  return <SignupFederation imageSrc="/assets/signupImage.svg" />;
  // The component for now accepts just one prop which is an Image link.
}
