'use client';

import * as React from 'react';
import { format } from 'date-fns';
import { Calendar as CalendarIcon } from 'lucide-react';

import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';

interface DatePickerProps {
  value: Date | undefined;
  onChange: (date: Date | undefined) => void;
  onBlur?: () => void; // Added for react-hook-form validation
  disabled?: (date: Date) => boolean;
  placeholder?: string;
  className?: string;
  error?: boolean;
}

export function DatePicker({
  value,
  onChange,
  onBlur,
  disabled,
  placeholder = 'Select date',
  className,
  error,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Handle date selection and trigger validation
  const handleSelect = (date: Date | undefined) => {
    onChange(date);
    setOpen(false);

    // Trigger validation by simulating blur event
    if (onBlur) {
      setTimeout(onBlur, 0);
    }
  };

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !value && 'text-muted-foreground',
            error && 'border-red-500 ring-1 ring-red-500',
            className
          )}
          onClick={() => {
            setOpen(true);
            // Trigger validation when opening the calendar
            if (onBlur) onBlur();
          }}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, 'PPP') : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value}
          onSelect={handleSelect}
          disabled={disabled}
          initialFocus
        />
      </PopoverContent>
    </Popover>
  );
}
