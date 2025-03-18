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
    <div className="flex h-screen w-full">
      {/*Left section , This is where the individual auth component will go*/}
      <div className="w-full lg:w-1/2 h-auto md:h-full flex flex-col justify-center px-4 sm:px-8 md:px-12 lg:px-20  py-8 md:py-0">
        {children}
      </div>

      {/* Right Section with Grey Background , This is where the Image will go */}
      <div className="hidden lg:flex w-0 md:w-1/2 h-48 md:h-full bg-gray-100 flex justify-center items-center relative ">
        <Image
          src={imageSrc} // Pass the imageSrc recieved from props
          alt="Signup Illustration"
          width={400}
          height={400}
          className="absolute"
          style={{
            top: '230px',
          }}
        />
      </div>
    </div>
  );
};
