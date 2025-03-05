import Link from 'next/link';

export const Logo = () => {
  return (
    <Link
      href="/"
      className="absolute top-10 left-10 text-3xl font-bold text-primary"
    >
      FedChess
    </Link>
  );
};

// Logo component to be used globally.
