import { ProfileType, Role } from '@prisma/client';

export const getProfileByRole = (role: string) => {
  switch (role) {
    case Role.PLAYER:
      return ProfileType.PLAYER;
    case Role.PARENT:
      return ProfileType.PARENT;
    //TODO: Add other roles here
    default:
      return ProfileType.PLAYER;
  }
};
