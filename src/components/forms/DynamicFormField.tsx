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
import { PhoneInput } from '@/components/phoneInput';
import DatePicker from '@/components/player-components/DatePicker';
import { renderLabel } from '@/components/RenderLabel';

interface DynamicFormFieldProps {
  field: FormFieldConfig;
  control: Control<any>;
  name: string;
}

export const DynamicFormField = ({
  field,
  control,
  name,
}: DynamicFormFieldProps) => {
  if (field.isHidden) return null;

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
                      placeholder={field.placeholder}
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
                        <SelectValue placeholder={field.placeholder} />
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
                      placeholder={field.placeholder}
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
                  return (
                    <FileUploader
                      field={formField}
                      uploadFolder={name as 'avatar' | 'age-proof'}
                      accept={field.validations?.acceptedFileTypes?.reduce(
                        (acc, type) => ({ ...acc, [type]: [] }),
                        {}
                      )}
                      label={
                        field.placeholder || 'Click or drag to upload file'
                      }
                    />
                  );

                case 'PHONE':
                  return (
                    <div className="flex gap-2">
                      <PhoneInput
                        placeholder={field.placeholder || 'Your phone number'}
                        defaultCountry="US"
                        defaultValue={formField.value || ''}
                        onCountrySelect={(countryCode) =>
                          formField.onChange({
                            ...formField.value,
                            countryCode,
                          })
                        }
                        onPhoneNumberChange={(phoneNumber) =>
                          formField.onChange({
                            ...formField.value,
                            phoneNumber,
                          })
                        }
                        className="w-full"
                      />
                    </div>
                  );

                case 'EMAIL':
                  return (
                    <Input
                      {...formField}
                      type="email"
                      placeholder={field.placeholder}
                      disabled={field.isDisabled}
                      className="w-full"
                    />
                  );

                case 'NUMBER':
                  return (
                    <Input
                      {...formField}
                      type="number"
                      placeholder={field.placeholder}
                      disabled={field.isDisabled}
                      min={field.validations?.min}
                      max={field.validations?.max}
                      className="w-full"
                    />
                  );

                default:
                  return (
                    <Input
                      {...formField}
                      placeholder={field.placeholder}
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
