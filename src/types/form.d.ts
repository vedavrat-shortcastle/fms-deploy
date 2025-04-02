import { FieldType, FormType } from '@prisma/client';

export interface FormFieldConfig {
  id: string;
  fieldName: string;
  displayName: string;
  fieldType: FieldType;
  isHidden: boolean;
  isMandatory: boolean;
  isDisabled: boolean;
  defaultValue?: string;
  placeholder?: string;
  validations?: {
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: string;
    options?: string[];
    acceptedFileTypes?: string[];
    maxFileSize?: number;
  };
  order: number;
  isCustomField: boolean;
}

export interface FormConfig {
  id: string;
  formType: FormType;
  isActive: boolean;
  fields: FormFieldConfig[];
}
