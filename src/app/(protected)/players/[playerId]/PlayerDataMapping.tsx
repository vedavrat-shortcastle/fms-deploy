import { EditPlayerFormValues } from '@/schemas/Player.schema';

export const mapPlayerData = (data: any): EditPlayerFormValues => ({
  baseUser: {
    id: data.id,
    email: data.email || '',
    firstName: data.firstName || '',
    lastName: data.lastName || '',
    middleName: data.middleName || '',
    nameSuffix: data.nameSuffix || '',
  },
  playerDetails: {
    birthDate: data.birthDate ? new Date(data.birthDate) : new Date(),
    gender: data.gender || undefined,
    avatarUrl: data.avatarUrl || undefined,
    ageProof: data.ageProof || undefined,
    streetAddress: data.streetAddress || '',
    streetAddress2: data.streetAddress2 || undefined,
    country: data.country || '',
    state: data.state || '',
    city: data.city || '',
    postalCode: data.postalCode || '',
    phoneNumber: data.phoneNumber || undefined,
    fideId: data.fideId || undefined,
    schoolName: data.schoolName || undefined,
    graduationYear: data.graduationYear || undefined,
    gradeInSchool: data.gradeInSchool || undefined,
    gradeDate: data.gradeDate ? new Date(data.gradeDate) : undefined,
    clubName: data.clubName || undefined,
  },
});

export const baseUserFields = [
  'id',
  'firstName',
  'lastName',
  'middleName',
  'nameSuffix',
  'email',
];
