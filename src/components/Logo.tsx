import Link from 'next/link';
// All the imports

export const Logo: React.FC<{ path: string }> = ({ path }) => {
  return (
    <Link
      href={path}
      className="text-2xl font-bold text-primary sm:flex sm:justify-center md:absolute md:top-10 md:left-10"
    >
      FedChess
    </Link>
  );
};

// Logo component to be used globally.
