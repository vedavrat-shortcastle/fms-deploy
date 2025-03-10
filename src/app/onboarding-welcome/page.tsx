import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';

// All the imports

export default function Home() {
  return (
    //  Main container Div
    <div className="min-h-screen flex flex-col">
      {/* Global Logo component */}
      <Logo />

      {/* Rocket Image is stored in public/assets/onboardingRocket.svg for now */}
      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="mb-8">
          {/* Rocket Image */}
          <Image
            src="/assets/onboardingRocket.svg"
            alt="Rocket icon"
            width={80}
            height={80}
            priority
          />
        </div>

        {/* Heading */}
        <h1 className="text-2xl font-extrabold mb-4 text-center">
          Welcome to FedChess
        </h1>

        {/* Sub-heading*/}
        <p className="text-md text-center mb-2">
          We&apos;re excited to have you on board. Our system simplifies the
          management of federated entities, making collaboration effortless and
          efficient.
        </p>
        <p className="text-xl text-center mb-6">Let&apos;s get started!</p>

        {/* Get Started button*/}
        {/* The button link route has to be decided for now */}
        <Button
          asChild
          className="bg-primary hover:bg-red-300 text-white font-bold px-10 py-2 h-auto w-60"
        >
          <Link href="#" className="text-lg">
            Get Started
          </Link>
        </Button>
      </div>

      {/* Wave background at bottom - matching the subtle curve in the image */}
      {/* The svg is stored in public/assets/waveBackground.svg for now */}
      <div className="relative w-full h-36 overflow-hidden">
        <img
          src="/assets/waveBackground.svg"
          alt="Wave Background"
          className="absolute bottom-0 left-0 w-full h-full"
        />
      </div>
    </div>
  );
}
