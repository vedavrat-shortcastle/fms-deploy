import CustomSubdomain from '@/components/auth-components/CustomSubdomain';

// All the Signup/Login/Onboarding components are in auth-components inside components folder.

export default function OnboardingPage() {
  return <CustomSubdomain imageSrc="/assets/onboardingImage2.svg" />;
  // The component for now accepts just one prop which is an Image link.
}
