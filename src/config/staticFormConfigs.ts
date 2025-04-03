import { FormFieldConfig } from '@/types/form';
import { FieldType, SupportedLanguages } from '@prisma/client';

export const AdminProfileFormConfig: FormFieldConfig[] = [
  {
    id: 'firstNameField',
    fieldName: 'firstName',
    displayName: 'First Name',
    placeholder: 'Enter First Name',
    fieldType: FieldType.TEXT,
    isMandatory: true,
    order: 1,
    validations: {
      minLength: 2,
      maxLength: 50,
    },
    isHidden: false,
    isDisabled: false,
    isCustomField: false,
  },
  {
    id: 'lastNameField',
    fieldName: 'lastName',
    displayName: 'Last Name',
    placeholder: 'Enter Last Name',
    fieldType: FieldType.TEXT,
    isMandatory: true,
    order: 2,
    validations: {
      minLength: 2,
      maxLength: 50,
    },
    isHidden: false,
    isDisabled: false,
    isCustomField: false,
  },
  {
    id: 'passwordField',
    fieldName: 'password',
    displayName: 'Password',
    placeholder: 'Enter New Password',
    fieldType: FieldType.TEXT,
    isMandatory: false,
    order: 3,
    validations: {
      minLength: 8,
    },
    isHidden: false,
    isDisabled: false,
    isCustomField: false,
  },
  {
    id: 'middleNameField',
    fieldName: 'middleName',
    displayName: 'Middle Name',
    placeholder: 'Enter Middle Name',
    fieldType: FieldType.TEXT,
    isMandatory: false,
    order: 4,
    validations: {
      maxLength: 50,
    },
    isHidden: false,
    isDisabled: false,
    isCustomField: false,
  },
  {
    id: 'nameSuffixField',
    fieldName: 'nameSuffix',
    displayName: 'Name Suffix',
    placeholder: 'Enter Name Suffix',
    fieldType: FieldType.TEXT,
    isMandatory: false,
    order: 5,
    validations: {
      maxLength: 10,
    },
    isHidden: false,
    isDisabled: false,
    isCustomField: false,
  },
  {
    id: 'languageField',
    fieldName: 'language',
    displayName: 'Language',
    placeholder: 'Select Language',
    fieldType: FieldType.SELECT,
    isMandatory: true,
    order: 6,
    validations: {
      options: Object.values(SupportedLanguages),
    },
    isHidden: false,
    isDisabled: false,
    isCustomField: false,
  },
];

export const AddMemberFormConfig: FormFieldConfig[] = [
  {
    id: 'playerIdField',
    fieldName: 'playerId',
    displayName: 'Player ID',
    placeholder: 'Enter Player ID',
    fieldType: FieldType.TEXT,
    isMandatory: true,
    order: 1,
    validations: {
      minLength: 1,
    },
    isHidden: false,
    isDisabled: false,
    isCustomField: false,
  },
  {
    id: 'planIdField',
    fieldName: 'planId',
    displayName: 'Plan ID',
    placeholder: 'Enter Plan ID',
    fieldType: FieldType.TEXT,
    isMandatory: true,
    order: 2,
    validations: {
      minLength: 1,
    },
    isHidden: false,
    isDisabled: false,
    isCustomField: false,
  },
  {
    id: 'subscriptionTypeField',
    fieldName: 'subscriptionType',
    displayName: 'Subscription Type',
    placeholder: 'Enter Subscription Type',
    fieldType: FieldType.TEXT,
    isMandatory: true,
    order: 3,
    validations: {
      minLength: 1,
    },
    isHidden: false,
    isDisabled: false,
    isCustomField: false,
  },
  {
    id: 'paymentModeField',
    fieldName: 'paymentMode',
    displayName: 'Payment Mode',
    placeholder: 'Select Payment Mode',
    fieldType: FieldType.SELECT,
    isMandatory: true,
    order: 4,
    validations: {
      options: ['Credit Card', 'Debit Card', 'UPI', 'Net Banking', 'Wallet'],
    },
    isHidden: false,
    isDisabled: false,
    isCustomField: false,
  },
];
