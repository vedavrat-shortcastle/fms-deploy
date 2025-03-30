import { DynamicFormField } from '@/components/forms/DynamicFormField';
import { FormConfig } from '@/types/form';
import { Control } from 'react-hook-form';

interface FormBuilderProps {
  config: FormConfig;
  control: Control<any>;
  basePrefix?: string;
}

export const FormBuilder = ({
  config,
  control,
  basePrefix = '',
}: FormBuilderProps) => {
  // Sort fields by order
  const sortedFields = [...config.fields].sort((a, b) => a.order - b.order);

  return (
    <div className="space-y-6">
      {sortedFields.map((field) => (
        <DynamicFormField
          key={field.id}
          field={field}
          control={control}
          name={`${basePrefix}${field.fieldName}`}
        />
      ))}
    </div>
  );
};
