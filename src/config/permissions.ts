export const PERMISSIONS = {
  // Federation permissions
  FED_VIEW: 'fed.view',
  FED_CREATE: 'fed.create',
  FED_UPDATE: 'fed.update',
  FED_DELETE: 'fed.delete',

  // Club permissions
  CLUB_VIEW: 'club.view',
  CLUB_CREATE: 'club.create',
  CLUB_UPDATE: 'club.update',
  CLUB_DELETE: 'club.delete',

  // Event permissions
  EVENT_VIEW: 'event.view',
  EVENT_CREATE: 'event.create',
  EVENT_UPDATE: 'event.update',
  EVENT_DELETE: 'event.delete',

  // Player permissions
  PLAYER_VIEW: 'player.view',
  PLAYER_CREATE: 'player.create',
  PLAYER_UPDATE: 'player.update',
  PLAYER_DELETE: 'player.delete',
} as const;

export const roleMap = {
  SUPER_ADMIN: [
    PERMISSIONS.FED_VIEW,
    PERMISSIONS.FED_CREATE,
    PERMISSIONS.FED_UPDATE,
    PERMISSIONS.FED_DELETE,
    PERMISSIONS.CLUB_VIEW,
    PERMISSIONS.CLUB_CREATE,
    PERMISSIONS.CLUB_UPDATE,
    PERMISSIONS.CLUB_DELETE,
    PERMISSIONS.EVENT_VIEW,
    PERMISSIONS.EVENT_CREATE,
    PERMISSIONS.EVENT_UPDATE,
    PERMISSIONS.EVENT_DELETE,
    PERMISSIONS.PLAYER_VIEW,
    PERMISSIONS.PLAYER_CREATE,
    PERMISSIONS.PLAYER_UPDATE,
    PERMISSIONS.PLAYER_DELETE,
  ],
  FED_ADMIN: [
    PERMISSIONS.CLUB_VIEW,
    PERMISSIONS.CLUB_CREATE,
    PERMISSIONS.CLUB_UPDATE,
    PERMISSIONS.CLUB_DELETE,
    PERMISSIONS.EVENT_VIEW,
    PERMISSIONS.EVENT_CREATE,
    PERMISSIONS.EVENT_UPDATE,
    PERMISSIONS.EVENT_DELETE,
    PERMISSIONS.PLAYER_VIEW,
    PERMISSIONS.PLAYER_CREATE,
    PERMISSIONS.PLAYER_UPDATE,
    PERMISSIONS.PLAYER_DELETE,
  ],
  CLUB_MANAGER: [
    PERMISSIONS.EVENT_VIEW,
    PERMISSIONS.EVENT_CREATE,
    PERMISSIONS.EVENT_UPDATE,
    PERMISSIONS.EVENT_DELETE,
    PERMISSIONS.PLAYER_VIEW,
    PERMISSIONS.PLAYER_CREATE,
    PERMISSIONS.PLAYER_UPDATE,
    PERMISSIONS.PLAYER_DELETE,
  ],
  PLAYER: [PERMISSIONS.EVENT_VIEW, PERMISSIONS.PLAYER_VIEW],
};
