import OnboardingFederation from '@/components/auth-components/OnboardingFederation';

// All the Signup/Login/Onboarding components are in auth-components inside components folder.

export default function OnboardingPage() {
  return <OnboardingFederation imageSrc="/assets/onboardingImage1.svg" />;
  // The component for now accepts just one prop which is an Image link.
}
