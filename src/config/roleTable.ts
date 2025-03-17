import { ProfileType, Role } from '@prisma/client';

export const getProfileByRole = (role: string) => {
  switch (role) {
    case Role.PLAYER:
      return ProfileType.PLAYER;
    case Role.CLUB_MANAGER:
      return ProfileType.CLUB_MANAGER;
    default:
      return ProfileType.PLAYER;
  }
};
