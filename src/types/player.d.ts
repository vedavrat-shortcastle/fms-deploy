export type Address = {
  street: string;
  street2?: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  phone: string;
};

export type PlayerDetails = {
  fideId: string;
};

export type StudentDetails = {
  schoolName: string;
  grade: string;
  graduationYear: string;
  gradeAsOf: string;
};

export type ClubInfo = {
  clubName?: string;
};

export type Player = {
  firstName: string;
  middleName?: string;
  lastName: string;
  nameSuffix?: string;
  birthDate: string;
  gender: string;
  email: string;
  ageProof?: string;
  address: Address;
  playerDetails: PlayerDetails;
  studentDetails: StudentDetails;
  clubInfo: ClubInfo;
  profileImage?: string;
};

// Type for the handleChange function's first parameter
export type PlayerSection =
  | 'base'
  | 'address'
  | 'playerDetails'
  | 'studentDetails'
  | 'clubInfo';
