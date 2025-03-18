// components/PasswordInput.tsx
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FormControl } from '@/components/ui/form';
import { ControllerRenderProps } from 'react-hook-form';

// All the imports

interface PasswordInputProps {
  field: ControllerRenderProps<any, any>; // Handles input state & validation
  placeholder?: string; // Default: 'Enter your password'
  className?: string; // Default: 'w-full'
}
//Props for this component

export const PasswordInput = ({
  field, // Mandatory prop
  placeholder = 'Enter your password',
  className = 'w-full',
}: PasswordInputProps) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <FormControl>
      <div className="relative w-full">
        <Input
          type={showPassword ? 'text' : 'password'}
          placeholder={placeholder} // Pass this as a prop or use the default value
          className={`${className} pr-10`} // Pass this as a prop or use the default value
          {...field}
        />
        <button
          type="button"
          className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 focus:outline-none"
          onClick={() => setShowPassword(!showPassword)}
          tabIndex={-1}
          aria-label={showPassword ? 'Hide password' : 'Show password'}
        >
          {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
        </button>
      </div>
    </FormControl>
  );
};
