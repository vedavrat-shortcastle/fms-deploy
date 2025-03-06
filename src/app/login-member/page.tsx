import { Login } from '@/components/auth-components/Login';

// All the Signup/Login/Onboarding components are in auth-components inside components folder.

export default function page() {
  return (
    <Login
      imageSrc="/assets/loginImage.svg"
      heading="Member"
      signUpHref="/sign-up-member"
    />
  );
  // The component for now accepts three props -
  // 1. Imagesrc      // One Possible Value for now , [public/assets/loginImage.svg]
  // 2. Heading       // Two Possible Values for now, Pass any one - [Federation, Member].
  // 3. Signuphref    // Two Possible Values for now, Pass any one - [/sign-up-member, /sign-up-federation].
}
