import Image from 'next/image';

interface AuthLayoutProps {
  children: React.ReactNode;
  imageSrc: string;
}
// Props for this component.

export const AuthLayout = ({ children, imageSrc }: AuthLayoutProps) => {
  return (
    <div className="flex h-screen w-full">
      {/*Left section , This is where the individual auth component will go*/}
      <div className="w-1/2 h-full flex flex-col justify-center items-start px-20">
        {children}
      </div>

      {/* Right Section with Grey Background , This is where the Image will go */}
      <div className="w-1/2 h-full bg-gray-200 flex justify-center items-center relative">
        <Image
          src={imageSrc}
          alt="Signup Illustration"
          width={500}
          height={500}
          className="absolute"
          style={{
            top: '280px',
          }}
        />
      </div>
    </div>
  );
};
