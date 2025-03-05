import { SignupMember } from '@/components/auth-components/SignupMember';

// All the Signup/Login/Onboarding components are in auth-components inside components folder.

export default function page() {
  return <SignupMember imageSrc="/assets/signupImage.svg" />;
  // The component for now accepts just one prop which is an Image link.
}
