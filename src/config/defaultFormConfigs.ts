import { FieldType, FormType } from '@prisma/client';

export const defaultFormConfigs = {
  [FormType.PLAYER]: {
    formType: FormType.PLAYER,
    fields: [
      // Personal Information
      {
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
      },
      {
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
      },
      {
        fieldName: 'middleName',
        displayName: 'Middle Name',
        placeholder: 'Enter Middle Name',
        fieldType: FieldType.TEXT,
        isMandatory: false,
        order: 3,
      },
      {
        fieldName: 'birthDate',
        displayName: 'Date of Birth',
        placeholder: 'Select Date of Birth',
        fieldType: FieldType.DATE,
        isMandatory: true,
        order: 4,
        validations: {
          maxDate: new Date().toISOString().split('T')[0],
        },
      },
      {
        fieldName: 'gender',
        displayName: 'Gender',
        placeholder: 'Select Gender',
        fieldType: FieldType.SELECT,
        isMandatory: true,
        order: 5,
        defaultValue: 'MALE',
        validations: {
          options: ['MALE', 'FEMALE', 'OTHER'],
        },
      },
      {
        fieldName: 'email',
        displayName: 'Email Address',
        placeholder: 'Enter Email Address',
        fieldType: FieldType.EMAIL,
        isMandatory: true,
        order: 6,
      },
      {
        fieldName: 'phoneNumber',
        displayName: 'Phone Number',
        placeholder: 'Enter Phone Number',
        fieldType: FieldType.PHONE,
        isMandatory: false,
        order: 7,
      },
      // Address Information
      {
        fieldName: 'streetAddress',
        displayName: 'Street Address',
        placeholder: 'Enter Street Address',
        fieldType: FieldType.TEXT,
        isMandatory: false,
        order: 9,
      },
      {
        fieldName: 'streetAddress2',
        displayName: 'Street Address Line 2',
        placeholder: 'Enter Street Address Line 2',
        fieldType: FieldType.TEXT,
        isMandatory: false,
        order: 10,
      },

      {
        fieldName: 'country',
        displayName: 'Country',
        placeholder: 'Select Country',
        fieldType: FieldType.COUNTRY,
        isMandatory: false,
        order: 11,
      },
      {
        fieldName: 'state',
        displayName: 'State/Province',
        placeholder: 'Select State/Province',
        fieldType: FieldType.STATE,
        isMandatory: false,
        order: 12,
      },
      {
        fieldName: 'city',
        displayName: 'City',
        placeholder: 'Select City',
        fieldType: FieldType.CITY,
        isMandatory: false,
        order: 13,
      },
      {
        fieldName: 'postalCode',
        displayName: 'Postal Code',
        placeholder: 'Enter Postal Code',
        fieldType: FieldType.TEXT,
        isMandatory: false,
        order: 14,
      },
      // Chess-specific Information
      {
        fieldName: 'fideId',
        displayName: 'FIDE ID',
        placeholder: 'Enter FIDE ID',
        fieldType: FieldType.TEXT,
        isMandatory: false,
        order: 15,
      },
      {
        fieldName: 'clubName',
        displayName: 'Club Name',
        placeholder: 'Enter Club Name',
        fieldType: FieldType.TEXT,
        isMandatory: false,
        order: 16,
      },
      // School Information
      {
        fieldName: 'schoolName',
        displayName: 'School Name',
        placeholder: 'Enter School Name',
        fieldType: FieldType.TEXT,
        isMandatory: false,
        order: 17,
      },
      {
        fieldName: 'graduationYear',
        displayName: 'Graduation Year',
        placeholder: 'Enter Graduation Year',
        fieldType: FieldType.NUMBER,
        isMandatory: false,
        order: 18,
        validations: {
          min: 2000,
          max: 2050,
          isNumber: true,
        },
      },
      {
        fieldName: 'gradeInSchool',
        displayName: 'Grade in School',
        placeholder: 'Enter Grade in School',
        fieldType: FieldType.TEXT,
        isMandatory: false,
        order: 19,
      },
      // Documents
      {
        fieldName: 'ageProof',
        displayName: 'Age Proof Document',
        placeholder: 'Upload Age Proof Document',
        fieldType: FieldType.FILE,
        isMandatory: false,
        order: 20,
        validations: {
          acceptedFileTypes: ['image/*', 'application/pdf'],
          maxFileSize: 5000000, // 5MB
        },
      },
      {
        fieldName: 'avatarUrl',
        displayName: 'Profile Picture',
        placeholder: 'Upload Profile Picture',
        fieldType: FieldType.FILE,
        isMandatory: false,
        order: 21,
        validations: {
          acceptedFileTypes: ['image/*'],
          maxFileSize: 2000000, // 2MB
        },
      },
    ],
  },
  [FormType.PARENT]: {
    formType: FormType.PARENT,
    fields: [
      // Personal Information
      {
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
      },
      {
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
      },
      {
        fieldName: 'email',
        displayName: 'Email Address',
        placeholder: 'Enter Email Address',
        fieldType: FieldType.EMAIL,
        isMandatory: true,
        order: 3,
      },
      {
        fieldName: 'phoneNumber',
        displayName: 'Phone Number',
        placeholder: 'Enter Phone Number',
        fieldType: FieldType.PHONE,
        isMandatory: true,
        order: 4,
      },
      // Address Information
      {
        fieldName: 'streetAddress',
        displayName: 'Street Address',
        placeholder: 'Enter Street Address',
        fieldType: FieldType.TEXT,
        isMandatory: true,
        order: 6,
      },
      {
        fieldName: 'streetAddress2',
        displayName: 'Street Address Line 2',
        placeholder: 'Enter Street Address Line 2',
        fieldType: FieldType.TEXT,
        isMandatory: false,
        order: 7,
      },
      {
        fieldName: 'country',
        displayName: 'Country',
        placeholder: 'Select Country',
        fieldType: FieldType.COUNTRY,
        isMandatory: true,
        order: 8,
      },
      {
        fieldName: 'state',
        displayName: 'State/Province',
        placeholder: 'Select State/Province',
        fieldType: FieldType.STATE,
        isMandatory: false,
        order: 9,
      },
      {
        fieldName: 'city',
        displayName: 'City',
        placeholder: 'Select City',
        fieldType: FieldType.CITY,
        isMandatory: true,
        order: 10,
      },
      {
        fieldName: 'postalCode',
        displayName: 'Postal Code',
        placeholder: 'Enter Postal Code',
        fieldType: FieldType.TEXT,
        isMandatory: true,
        order: 11,
      },
    ],
  },
  [FormType.CLUB]: {
    formType: FormType.CLUB,
    fields: [
      {
        fieldName: 'name',
        displayName: 'Club Name',
        placeholder: 'Enter Club Name',
        fieldType: FieldType.TEXT,
        isMandatory: true,
        order: 1,
        validations: {
          minLength: 3,
          maxLength: 100,
        },
      },
      {
        fieldName: 'managerEmail',
        displayName: 'Manager Email',
        placeholder: 'Enter Manager Email',
        fieldType: FieldType.EMAIL,
        isMandatory: true,
        order: 2,
      },
    ],
  },
  [FormType.EVENT]: {
    formType: FormType.EVENT,
    fields: [
      {
        fieldName: 'name',
        displayName: 'Event Name',
        placeholder: 'Enter Event Name',
        fieldType: FieldType.TEXT,
        isMandatory: true,
        order: 1,
      },
      {
        fieldName: 'description',
        displayName: 'Description',
        placeholder: 'Enter Description',
        fieldType: FieldType.TEXTAREA,
        isMandatory: true,
        order: 2,
      },
      {
        fieldName: 'mode',
        displayName: 'Event Mode',
        placeholder: 'Select Event Mode',
        fieldType: FieldType.SELECT,
        isMandatory: true,
        order: 3,
        validations: {
          options: ['ONLINE', 'OFFLINE'],
        },
      },
      {
        fieldName: 'venue',
        displayName: 'Venue',
        placeholder: 'Enter Venue',
        fieldType: FieldType.TEXT,
        isMandatory: false,
        order: 4,
      },
      {
        fieldName: 'startDate',
        displayName: 'Start Date',
        placeholder: 'Select Start Date',
        fieldType: FieldType.DATE,
        isMandatory: true,
        order: 5,
      },
      {
        fieldName: 'endDate',
        displayName: 'End Date',
        placeholder: 'Select End Date',
        fieldType: FieldType.DATE,
        isMandatory: true,
        order: 6,
      },
      {
        fieldName: 'format',
        displayName: 'Tournament Format',
        placeholder: 'Select Tournament Format',
        fieldType: FieldType.SELECT,
        isMandatory: true,
        order: 7,
        validations: {
          options: ['SWISS', 'QUAD', 'TEAM'],
        },
      },
      {
        fieldName: 'numberOfRounds',
        displayName: 'Number of Rounds',
        placeholder: 'Enter Number of Rounds',
        fieldType: FieldType.NUMBER,
        isMandatory: true,
        order: 8,
        validations: {
          min: 1,
          max: 20,
        },
      },
      {
        fieldName: 'timeControl',
        displayName: 'Time Control',
        placeholder: 'Enter Time Control',
        fieldType: FieldType.TEXT,
        isMandatory: true,
        order: 9,
      },
      {
        fieldName: 'isRated',
        displayName: 'Is Rated Tournament',
        placeholder: 'Check if Rated Tournament',
        fieldType: FieldType.CHECKBOX,
        isMandatory: true,
        order: 10,
      },
    ],
  },
  [FormType.MEMBERSHIP]: {
    formType: FormType.MEMBERSHIP,
    fields: [
      {
        fieldName: 'name',
        displayName: 'Plan Name',
        placeholder: 'Enter Plan Name',
        fieldType: FieldType.TEXT,
        isMandatory: true,
        order: 1,
        validations: {
          minLength: 3,
          maxLength: 100,
        },
      },
      {
        fieldName: 'duration',
        displayName: 'Duration (months)',
        placeholder: 'Enter Duration in Months',
        fieldType: FieldType.NUMBER,
        isMandatory: true,
        order: 2,
        validations: {
          min: 1,
          max: 120,
          isNumber: true,
        },
      },
      {
        fieldName: 'currency',
        displayName: 'Currency',
        placeholder: 'Select Currency',
        fieldType: FieldType.SELECT,
        isMandatory: true,
        order: 3,
        validations: {
          options: ['usd', 'eur', 'nzd'],
        },
      },
      {
        fieldName: 'price',
        displayName: 'Price',
        placeholder: 'Enter Price',
        fieldType: FieldType.NUMBER,
        isMandatory: true,
        order: 4,
        validations: {
          min: 0,
          isNumber: true,
        },
      },
      {
        fieldName: 'benefits',
        displayName: 'Benefits',
        placeholder: 'Enter each benefit separated by a comma',
        fieldType: FieldType.TEXTAREA,
        isMandatory: true,
        order: 5,
      },
      {
        fieldName: 'description',
        displayName: 'Description',
        placeholder: 'Enter Description',
        fieldType: FieldType.TEXTAREA,
        isMandatory: true,
        order: 6,
      },
      {
        fieldName: 'autoRenewal',
        displayName: 'Auto-Renewal',
        placeholder: 'Enable Auto-Renewal',
        fieldType: FieldType.CHECKBOX,
        isMandatory: false,
        order: 7,
        defaultValue: 'false',
      },
    ],
  },
};
