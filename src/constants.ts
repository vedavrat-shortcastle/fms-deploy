export const PERMISSIONS = {
  // Organization permissions
  ORG_VIEW: 'org.view',
  ORG_CREATE: 'org.create',
  ORG_UPDATE: 'org.update',
  ORG_DELETE: 'org.delete',

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

  // User permissions
  USER_VIEW: 'user.view',
  USER_CREATE: 'user.create',
  USER_UPDATE: 'user.update',
  USER_DELETE: 'user.delete',
} as const;
