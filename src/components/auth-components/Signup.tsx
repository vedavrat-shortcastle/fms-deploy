import { AuthLayout } from '@/components/layouts/AuthLayout';

interface SignupProps {
  imageSrc: string;
}
// Props for this component.

export const Signup = ({ imageSrc }: SignupProps) => {
  return (
    // Dont wrap this in a div as it will mess the layout.
    <AuthLayout imageSrc={imageSrc}>
      {/* This is where the form Logic will go */}
      <div className="m-40">
        Lorem ipsum dolor sit amet consectetur, adipisicing elit. Veniam
        delectus beatae placeat enim voluptas facilis consequuntur saepe. Sunt
        alias delectus commodi quo, quos porro ut officia ipsum at, ea pariatur?
      </div>
    </AuthLayout>
  );
};
