// dummyData.ts
export type Player = {
  firstName: string;
  middleName?: string;
  lastName: string;
  nameSuffix?: string;
  birthDate: string;
  gender: string;
  email: string;
  ageProof?: string;
  profileImage?: string;
  address: {
    street: string;
    street2?: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
    phone: string;
  };
  playerDetails: {
    fideId: string;
  };
  studentDetails: {
    schoolName: string;
    grade: string;
    graduationYear: string;
    gradeAsOf: string;
  };
  clubInfo: {
    clubName?: string;
  };
};

export const playerData: Player = {
  firstName: 'Spencer',
  middleName: '-',
  lastName: 'Jhon',
  nameSuffix: 'Mr',
  birthDate: '02-11-2001',
  gender: 'Male',
  email: 'spencerjhon@example.com',
  ageProof: 'Download',
  profileImage:
    'https://hebbkx1anhila5yf.public.blob.vercel-storage.com/FedChess-czsmte0PpvLkqa7dQ95TlcS3XlX5ZD.png',
  address: {
    street: 'Address',
    street2: '-',
    city: 'Panama City',
    state: 'Panama',
    postalCode: '32401',
    country: 'Panama',
    phone: '+1 (555) 456-7890',
  },
  playerDetails: {
    fideId: '5520164',
  },
  studentDetails: {
    schoolName: 'School name',
    grade: '3rd',
    graduationYear: '2024',
    gradeAsOf: '23-10-2024',
  },
  clubInfo: {
    clubName: '-',
  },
};
