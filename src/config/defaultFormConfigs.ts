import { FieldType, FormType } from '@prisma/client';

export const defaultFormConfigs = {
  [FormType.PLAYER]: {
    formType: FormType.PLAYER,
    fields: [
      // Personal Information
      {
        fieldName: 'firstName',
        displayName: 'First Name',
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
        fieldType: FieldType.TEXT,
        isMandatory: false,
        order: 3,
      },
      {
        fieldName: 'birthDate',
        displayName: 'Date of Birth',
        fieldType: FieldType.DATE,
        isMandatory: true,
        order: 4,
      },
      {
        fieldName: 'gender',
        displayName: 'Gender',
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
        fieldType: FieldType.EMAIL,
        isMandatory: true,
        order: 6,
      },
      {
        fieldName: 'phoneNumber',
        displayName: 'Phone Number',
        fieldType: FieldType.PHONE,
        isMandatory: false,
        order: 7,
      },
      {
        fieldName: 'countryCode',
        displayName: 'Country Code',
        fieldType: FieldType.TEXT,
        isMandatory: false,
        order: 8,
      },
      // Address Information
      {
        fieldName: 'streetAddress',
        displayName: 'Street Address',
        fieldType: FieldType.TEXT,
        isMandatory: false,
        order: 9,
      },
      {
        fieldName: 'streetAddress2',
        displayName: 'Street Address Line 2',
        fieldType: FieldType.TEXT,
        isMandatory: false,
        order: 10,
      },
      {
        fieldName: 'city',
        displayName: 'City',
        fieldType: FieldType.TEXT,
        isMandatory: false,
        order: 11,
      },
      {
        fieldName: 'state',
        displayName: 'State/Province',
        fieldType: FieldType.TEXT,
        isMandatory: false,
        order: 12,
      },
      {
        fieldName: 'country',
        displayName: 'Country',
        fieldType: FieldType.TEXT,
        isMandatory: false,
        order: 13,
      },
      {
        fieldName: 'postalCode',
        displayName: 'Postal Code',
        fieldType: FieldType.TEXT,
        isMandatory: false,
        order: 14,
      },
      // Chess-specific Information
      {
        fieldName: 'fideId',
        displayName: 'FIDE ID',
        fieldType: FieldType.TEXT,
        isMandatory: false,
        order: 15,
      },
      {
        fieldName: 'clubName',
        displayName: 'Club Name',
        fieldType: FieldType.TEXT,
        isMandatory: false,
        order: 16,
      },
      // School Information
      {
        fieldName: 'schoolName',
        displayName: 'School Name',
        fieldType: FieldType.TEXT,
        isMandatory: false,
        order: 17,
      },
      {
        fieldName: 'graduationYear',
        displayName: 'Graduation Year',
        fieldType: FieldType.NUMBER,
        isMandatory: false,
        order: 18,
        validations: {
          min: 2000,
          max: 2050,
        },
      },
      {
        fieldName: 'gradeInSchool',
        displayName: 'Grade in School',
        fieldType: FieldType.TEXT,
        isMandatory: false,
        order: 19,
      },
      // Documents
      {
        fieldName: 'ageProof',
        displayName: 'Age Proof Document',
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
        fieldType: FieldType.EMAIL,
        isMandatory: true,
        order: 3,
      },
      {
        fieldName: 'phoneNumber',
        displayName: 'Phone Number',
        fieldType: FieldType.PHONE,
        isMandatory: true,
        order: 4,
      },
      {
        fieldName: 'countryCode',
        displayName: 'Country Code',
        fieldType: FieldType.TEXT,
        isMandatory: true,
        order: 5,
      },
      // Address Information
      {
        fieldName: 'streetAddress',
        displayName: 'Street Address',
        fieldType: FieldType.TEXT,
        isMandatory: true,
        order: 6,
      },
      {
        fieldName: 'streetAddress2',
        displayName: 'Street Address Line 2',
        fieldType: FieldType.TEXT,
        isMandatory: false,
        order: 7,
      },
      {
        fieldName: 'city',
        displayName: 'City',
        fieldType: FieldType.TEXT,
        isMandatory: true,
        order: 8,
      },
      {
        fieldName: 'state',
        displayName: 'State/Province',
        fieldType: FieldType.TEXT,
        isMandatory: true,
        order: 9,
      },
      {
        fieldName: 'country',
        displayName: 'Country',
        fieldType: FieldType.TEXT,
        isMandatory: true,
        order: 10,
      },
      {
        fieldName: 'postalCode',
        displayName: 'Postal Code',
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
        fieldType: FieldType.TEXT,
        isMandatory: true,
        order: 1,
      },
      {
        fieldName: 'description',
        displayName: 'Description',
        fieldType: FieldType.TEXTAREA,
        isMandatory: true,
        order: 2,
      },
      {
        fieldName: 'mode',
        displayName: 'Event Mode',
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
        fieldType: FieldType.TEXT,
        isMandatory: false,
        order: 4,
      },
      {
        fieldName: 'startDate',
        displayName: 'Start Date',
        fieldType: FieldType.DATE,
        isMandatory: true,
        order: 5,
      },
      {
        fieldName: 'endDate',
        displayName: 'End Date',
        fieldType: FieldType.DATE,
        isMandatory: true,
        order: 6,
      },
      {
        fieldName: 'format',
        displayName: 'Tournament Format',
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
        fieldType: FieldType.TEXT,
        isMandatory: true,
        order: 9,
      },
      {
        fieldName: 'isRated',
        displayName: 'Is Rated Tournament',
        fieldType: FieldType.CHECKBOX,
        isMandatory: true,
        order: 10,
      },
    ],
  },
};
