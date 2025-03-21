export const PERMISSIONS = {
  // Federation permissions
  FED_ALL: 'fed:all',
  FED_VIEW: 'fed:view',
  FED_CREATE: 'fed:create',
  FED_UPDATE: 'fed:update',
  FED_DELETE: 'fed:delete',

  // Club permissions
  CLUB_ALL: 'club:all',
  CLUB_VIEW: 'club:view',
  CLUB_CREATE: 'club:create',
  CLUB_UPDATE: 'club:update',
  CLUB_DELETE: 'club:delete',

  // Event permissions
  EVENT_ALL: 'event:all',
  EVENT_VIEW: 'event:view',
  EVENT_CREATE: 'event:create',
  EVENT_UPDATE: 'event:update',
  EVENT_DELETE: 'event:delete',

  // Player permissions
  PLAYER_ALL: 'player:all',
  PLAYER_VIEW: 'player:view',
  PLAYER_CREATE: 'player:create',
  PLAYER_UPDATE: 'player:update',
  PLAYER_DELETE: 'player:delete',

  // Parent permissions
  PARENT_ALL: 'parent:all',
  PARENT_CREATE: 'parent:create',
  PARENT_VIEW: 'parent:view',
  PARENT_UPDATE: 'parent:update',
  PARENT_DELETE: 'parent:delete',

  // Plan permissions
  PLAN_ALL: 'plan:all',
  PLAN_CREATE: 'plan:create',
  PLAN_VIEW: 'plan:view',
  PLAN_UPDATE: 'plan:update',
  PLAN_DELETE: 'plan:delete',
} as const;

export const roleMap = {
  FED_ADMIN: [
    PERMISSIONS.FED_ALL,
    PERMISSIONS.CLUB_ALL,
    PERMISSIONS.EVENT_ALL,
    PERMISSIONS.PLAYER_ALL,
    PERMISSIONS.PLAN_ALL,
  ],
  CLUB_MANAGER: [
    PERMISSIONS.CLUB_ALL,
    PERMISSIONS.EVENT_ALL,
    PERMISSIONS.PLAYER_ALL,
  ],
  PLAYER: [
    PERMISSIONS.PLAYER_ALL,
    PERMISSIONS.EVENT_VIEW,
    PERMISSIONS.PLAN_VIEW,
  ],
  PARENT: [
    PERMISSIONS.PARENT_ALL,
    PERMISSIONS.PLAYER_CREATE,
    PERMISSIONS.PLAYER_VIEW,
    PERMISSIONS.PLAYER_UPDATE,
    PERMISSIONS.PLAN_VIEW,
    PERMISSIONS.EVENT_VIEW,
  ],
};
