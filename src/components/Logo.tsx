import Link from 'next/link';
// All the imports

export const Logo = () => {
  return (
    <Link
      href="/"
      className="absolute top-10 left-10 text-2xl font-bold text-primary"
    >
      FedChess
    </Link>
  );
};

// Logo component to be used globally.
