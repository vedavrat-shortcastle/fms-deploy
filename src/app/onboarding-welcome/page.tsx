import Link from 'next/link';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Logo } from '@/components/Logo';

// All the imports

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col">
      {/* Main content - centered vertically and horizontally */}

      <Logo />
      {/* Global Logo component */}

      <div className="flex-1 flex flex-col items-center justify-center px-4">
        <div className="mb-8">
          {/* Rocket Image */}
          <Image
            src="/assets/onboardingRocket.svg"
            alt="Rocket icon"
            width={120}
            height={100}
            priority
          />
        </div>

        {/* Heading */}
        <h1 className="text-3xl font-bold mb-4 text-center">
          Welcome to FedChess
        </h1>

        {/* Sub-heading*/}
        <p className="text-xl text-center mb-8">
          We&apos;re excited to have you on board. Our system simplifies the
          management of federated entities, making collaboration effortless and
          efficient.
        </p>
        <p className="text-2xl text-center mb-8">Let&apos;s get started!</p>

        {/* Get Started button*/}
        <Button
          asChild
          className="bg-primary hover:bg-red-300 text-white font-bold px-10 py-2 h-auto w-80"
        >
          <Link href="#" className="text-xl">
            Get Started
          </Link>
        </Button>
      </div>

      {/* Wave background at bottom - matching the subtle curve in the image */}
      <div className="relative w-full h-64 mt-auto overflow-hidden">
        <svg
          className="absolute bottom-0 left-0 w-full h-full"
          viewBox="0 0 1440 320"
          preserveAspectRatio="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <path
            fill="#d1d5db" // Gray-300 color
            d="M0,256L80,229.3C160,203,320,149,480,133.3C640,117,800,139,960,170.7C1120,203,1280,245,1360,266.7L1440,288V320H1360C1280,320,1120,320,960,320C800,320,640,320,480,320C320,320,160,320,80,320H0Z"
          />
        </svg>
      </div>
    </div>
  );
}
