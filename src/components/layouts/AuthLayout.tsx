import Image from 'next/image';

// All the imports

interface AuthLayoutProps {
  children: React.ReactNode;
  imageSrc: string;
}
// Props for this component.

// This will serve as a wrapper for all the onboarding routes - why?
// Since all the onboarding routes have same structure - 50% width is form and 50% is image.

// The Layout will accept 2 Props for now -
// 1. children - Individual Auth form component (Form logic) - Currently stored in auth components.
// 2. imageSrc - Image link - Currently stored in public/assets.

export const AuthLayout = ({ children, imageSrc }: AuthLayoutProps) => {
  return (
    <div className="flex min-h-svh w-full">
      {/*Left section , This is where the individual auth component will go*/}
      <div className="w-full lg:w-1/2 min-h-screen flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-20  py-8 md:py-0">
        {children}
      </div>

      {/* Right Section with Grey Background , This is where the Image will go */}
      <div className="hidden lg:flex w-1/2 min-h-screen bg-gray-100 justify-center items-center">
        <div className="w-[70%] h-[70%] relative">
          <Image
            src={imageSrc}
            alt="Signup Illustration"
            fill={true}
            className="object-contain"
          />
        </div>
      </div>
    </div>
  );
};
