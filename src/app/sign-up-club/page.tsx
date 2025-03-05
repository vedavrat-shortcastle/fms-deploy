import { SignupClub } from '@/components/auth-components/SignupClub';

// All the Signup/Login/Onboarding components are in auth-components inside components folder.

export default function page() {
  return <SignupClub imageSrc="/assets/onboardingImage1.svg" />;
  // The component for now accepts just one prop which is an Image link.
}
