// PhoneInput.jsx
import * as React from 'react';
import { CheckIcon, ChevronsUpDown } from 'lucide-react';
import * as RPNInput from 'react-phone-number-input';
import flags from 'react-phone-number-input/flags';
import { getCountries, getCountryCallingCode } from 'react-phone-number-input';
import en from 'react-phone-number-input/locale/en.json';

import { Button } from '@/components/ui/button';
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command';
import { Input } from '@/components/ui/input';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Label } from '@/components/ui/label';
import { renderLabel } from '@/components/RenderLable';

// Updated PhoneInputProps type with new callback props
type PhoneInputProps = {
  placeholder?: string;
  defaultCountry?: RPNInput.Country | undefined;
  className?: string;
  onCountrySelect?: (countryCode: string) => void;
  onPhoneNumberChange?: (phoneNumber: string) => void;
};

const PhoneInput = React.forwardRef<HTMLInputElement, PhoneInputProps>(
  (
    {
      placeholder,
      defaultCountry = 'US',
      className,
      onCountrySelect,
      onPhoneNumberChange,
    },
    ref
  ) => {
    const [countryCode, setCountryCode] = React.useState(
      getCountryCallingCode(defaultCountry)
    );
    const [phoneNumber, setPhoneNumber] = React.useState('');
    const [selectedCountry, setSelectedCountry] =
      React.useState<RPNInput.Country>(defaultCountry);

    // Sync country code with selected country
    React.useEffect(() => {
      const callingCode = getCountryCallingCode(selectedCountry);
      if (callingCode !== countryCode) {
        setCountryCode(callingCode);
      }
    }, [selectedCountry, countryCode]);

    // Handle phone number input change
    const handlePhoneNumberChangeInternal = (
      e: React.ChangeEvent<HTMLInputElement>
    ) => {
      const newValue = e.target.value;
      setPhoneNumber(newValue);
      if (onPhoneNumberChange) {
        onPhoneNumberChange(newValue);
      }
    };

    // Handle country change
    const handleCountryChange = (country: RPNInput.Country) => {
      const callingCode = getCountryCallingCode(country);
      setCountryCode(callingCode);
      setSelectedCountry(country);
      if (onCountrySelect) {
        onCountrySelect(callingCode);
      }
    };

    return (
      <div className={cn('flex flex-col gap-4', className)}>
        <Label> {renderLabel('Phone Number', true)}</Label>
        {/* Changed from <form> to <div> */}
        <div className="flex items-center gap-2">
          {/* Country Selector */}
          <CountrySelect
            disabled={false}
            value={selectedCountry}
            onChange={handleCountryChange}
          />
          {/* Phone Number Input */}
          <Input
            ref={ref}
            type="tel"
            className="rounded-e-lg rounded-s-none w-full"
            value={phoneNumber}
            onChange={handlePhoneNumberChangeInternal}
            placeholder={placeholder || 'Enter phone number'}
            pattern="[0-9]*"
          />
        </div>
      </div>
    );
  }
);

PhoneInput.displayName = 'PhoneInput';

// CountryEntry and CountrySelect components remain unchanged
type CountryEntry = { label: string; value: RPNInput.Country };

type CountrySelectProps = {
  disabled?: boolean;
  value: RPNInput.Country;
  onChange: (country: RPNInput.Country) => void;
};

const CountrySelect = ({
  disabled,
  value: selectedCountry,
  onChange,
}: CountrySelectProps) => {
  const [search, setSearch] = React.useState('');

  const countryList: CountryEntry[] = React.useMemo(() => {
    return getCountries().map((country) => ({
      value: country,
      label: en[country] || country,
    }));
  }, []);

  const filteredCountryList = React.useMemo(
    () =>
      countryList.filter(({ label }) =>
        label.toLowerCase().includes(search.toLowerCase())
      ),
    [countryList, search]
  );

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          className="flex gap-1 h-[42px] rounded-e-none rounded-s-lg border-r-0 px-3 focus:z-10"
          disabled={disabled}
        >
          <FlagComponent
            country={selectedCountry}
            countryName={en[selectedCountry] || selectedCountry}
          />
          <span className="text-sm">
            +{getCountryCallingCode(selectedCountry)}
          </span>
          <ChevronsUpDown
            className={cn(
              '-mr-2 size-4 opacity-50',
              disabled ? 'hidden' : 'opacity-100'
            )}
          />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput
            placeholder="Search country..."
            value={search}
            onValueChange={setSearch}
          />
          <CommandList>
            <ScrollArea className="h-72">
              <CommandEmpty>No country found.</CommandEmpty>
              <CommandGroup>
                {filteredCountryList.map(({ value, label }) => (
                  <CountrySelectOption
                    key={value}
                    country={value}
                    countryName={label}
                    selectedCountry={selectedCountry}
                    onChange={onChange}
                  />
                ))}
              </CommandGroup>
            </ScrollArea>
          </CommandList>
        </Command>
      </PopoverContent>
    </Popover>
  );
};

interface CountrySelectOptionProps extends RPNInput.FlagProps {
  selectedCountry: RPNInput.Country;
  onChange: (country: RPNInput.Country) => void;
}

const CountrySelectOption = ({
  country,
  countryName,
  selectedCountry,
  onChange,
}: CountrySelectOptionProps) => {
  return (
    <CommandItem className="gap-2" onSelect={() => onChange(country)}>
      <FlagComponent country={country} countryName={countryName} />
      <span className="flex-1 text-sm">{countryName}</span>
      <span className="text-sm text-foreground/50">{`+${getCountryCallingCode(country)}`}</span>
      <CheckIcon
        className={`ml-auto size-4 ${country === selectedCountry ? 'opacity-100' : 'opacity-0'}`}
      />
    </CommandItem>
  );
};

const FlagComponent = ({ country, countryName }: RPNInput.FlagProps) => {
  const Flag = flags[country];

  return (
    <span className="flex h-4 w-6 overflow-hidden rounded-sm bg-foreground/20 [&_svg]:size-full">
      {Flag ? <Flag title={countryName} /> : null}
    </span>
  );
};

export { PhoneInput };
