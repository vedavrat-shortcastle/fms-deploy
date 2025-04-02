import { FormFieldConfig } from '@/types/form';
import { Control } from 'react-hook-form';
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Textarea } from '@/components/ui/textarea';
import { FileUploader } from '@/components/FileUploader';
import { PhoneInput } from '@/components/PhoneInput';
import DatePicker from '@/components/DatePicker';
import { renderLabel } from '@/components/RenderLabel';
import { Country, State, City } from 'country-state-city';
import { Button } from '@/components/ui/button';
import { FileText } from 'lucide-react';
import { useTranslation } from 'react-i18next';

interface DynamicFormFieldProps {
  field: FormFieldConfig & {
    dependentValue?: {
      country?: string;
      state?: string;
    };
  };
  control: Control<any>;
  name: string;
}

const UPLOAD_FOLDER_MAP: Record<string, 'avatar' | 'age-proof'> = {
  avatarUrl: 'avatar',
  ageProof: 'age-proof',
};

export const DynamicFormField = ({
  field,
  control,
  name,
}: DynamicFormFieldProps) => {
  const { t } = useTranslation();
  if (field.isHidden) return null;
  const baseFieldName = name.split('.').pop() || '';

  return (
    <FormField
      control={control}
      name={name}
      render={({ field: formField }) => (
        <FormItem>
          <FormLabel>
            {renderLabel(field.displayName, field.isMandatory)}
          </FormLabel>
          <FormControl>
            {(() => {
              switch (field.fieldType) {
                case 'TEXT':
                  return (
                    <Input
                      {...formField}
                      placeholder={
                        field.placeholder ||
                        `${t('enter')} ${field.displayName}`
                      }
                      disabled={field.isDisabled}
                      className="w-full"
                    />
                  );

                case 'SELECT':
                  return (
                    <Select
                      value={formField.value || ''}
                      onValueChange={formField.onChange}
                      disabled={field.isDisabled}
                    >
                      <SelectTrigger>
                        <SelectValue
                          placeholder={
                            field.placeholder ||
                            `${t('enter')} ${field.displayName}`
                          }
                        />
                      </SelectTrigger>
                      <SelectContent>
                        {field.validations?.options?.map((option) => (
                          <SelectItem key={option} value={option}>
                            {option}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );

                case 'CHECKBOX':
                  return (
                    <Checkbox
                      checked={formField.value}
                      onCheckedChange={formField.onChange}
                      disabled={field.isDisabled}
                    />
                  );

                case 'TEXTAREA':
                  return (
                    <Textarea
                      {...formField}
                      placeholder={
                        field.placeholder ||
                        `${t('enter')} ${field.displayName}`
                      }
                      disabled={field.isDisabled}
                      className="w-full"
                    />
                  );

                case 'DATE':
                  return (
                    <DatePicker
                      field={formField}
                      allowFuture={true}
                      allowPast={true}
                    />
                  );

                case 'FILE':
                  return formField.value ? (
                    <div className="flex items-center gap-4">
                      <a
                        href={formField.value}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-blue-500 flex items-center gap-2"
                      >
                        <FileText className="w-5 h-5" />
                        {t('file')}
                      </a>
                      <Button
                        variant="ghost"
                        onClick={() => formField.onChange(undefined)}
                        disabled={field.isDisabled}
                      >
                        {t('changeFile')}
                      </Button>
                    </div>
                  ) : (
                    <FileUploader
                      field={formField}
                      uploadFolder={
                        UPLOAD_FOLDER_MAP[baseFieldName] || 'avatar'
                      }
                      accept={field.validations?.acceptedFileTypes?.reduce(
                        (acc, type) => ({ ...acc, [type]: [] }),
                        {}
                      )}
                      label={
                        field.placeholder ||
                        `${t('enter')} ${field.displayName}` ||
                        t('clickOrDragToUpload')
                      }
                    />
                  );

                case 'PHONE':
                  return (
                    <PhoneInput
                      {...formField}
                      placeholder={
                        field.placeholder ||
                        `${t('enter')} ${field.displayName}`
                      }
                      className="w-full"
                    />
                  );

                case 'EMAIL':
                  return (
                    <Input
                      {...formField}
                      type="email"
                      placeholder={
                        field.placeholder ||
                        `${t('enter')} ${field.displayName}`
                      }
                      disabled={field.isDisabled}
                      className="w-full"
                    />
                  );

                case 'NUMBER':
                  return (
                    <Input
                      {...formField}
                      type="number"
                      placeholder={
                        field.placeholder ||
                        `${t('enter')} ${field.displayName}`
                      }
                      disabled={field.isDisabled}
                      min={field.validations?.min}
                      max={field.validations?.max}
                      onChange={(e) => {
                        const value = e.target.value;
                        formField.onChange(
                          value ? parseInt(value, 10) : undefined
                        ); // Ensure value is parsed as a number
                      }}
                      className="w-full"
                    />
                  );

                case 'COUNTRY': {
                  const countries = Country.getAllCountries();
                  const countryIso = Country.getCountryByCode(
                    formField.value
                  )?.isoCode;

                  return (
                    <Select
                      onValueChange={formField.onChange}
                      disabled={field.isDisabled}
                      value={countryIso || ''}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectCountry')} />
                      </SelectTrigger>
                      <SelectContent>
                        {countries.map((country) => (
                          <SelectItem
                            key={country.isoCode}
                            value={country.isoCode}
                          >
                            {country.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }

                case 'STATE': {
                  const selectedCountry = field.dependentValue?.country || '';
                  const states = selectedCountry
                    ? State.getStatesOfCountry(selectedCountry)
                    : [];
                  const stateIso = State.getStateByCodeAndCountry(
                    formField.value,
                    selectedCountry
                  )?.isoCode;

                  return (
                    <Select
                      value={stateIso || ''}
                      onValueChange={formField.onChange}
                      disabled={!selectedCountry || field.isDisabled}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectState')} />
                      </SelectTrigger>
                      <SelectContent>
                        {states.map((state) => (
                          <SelectItem key={state.isoCode} value={state.isoCode}>
                            {state.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }

                case 'CITY': {
                  const selectedCountry = field.dependentValue?.country || '';
                  const selectedState = field.dependentValue?.state || '';
                  const cities =
                    selectedCountry && selectedState
                      ? City.getCitiesOfState(selectedCountry, selectedState)
                      : [];
                  return (
                    <Select
                      value={formField.value || ''}
                      onValueChange={formField.onChange}
                      disabled={!selectedState || field.isDisabled}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder={t('selectCity')} />
                      </SelectTrigger>
                      <SelectContent>
                        {cities.map((city) => (
                          <SelectItem key={city.name} value={city.name}>
                            {city.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  );
                }

                default:
                  return (
                    <Input
                      {...formField}
                      placeholder={
                        field.placeholder ||
                        `${t('enter')} ${field.displayName}`
                      }
                      disabled={field.isDisabled}
                      className="w-full"
                    />
                  );
              }
            })()}
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
