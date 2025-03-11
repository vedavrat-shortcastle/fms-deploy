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

  // Member permissions
  MEMBER_VIEW: 'member.view',
  MEMBER_CREATE: 'member.create',
  MEMBER_UPDATE: 'member.update',
  MEMBER_DELETE: 'member.delete',
} as const;
