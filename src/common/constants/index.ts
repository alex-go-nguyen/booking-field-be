export const RESPONSE_MESSAGE = 'response_message';

export const ROLES_KEY = 'role';

export const BASE_COLUMNS = [
  {
    name: 'id',
    type: 'int',
    isPrimary: true,
    isGenerated: true,
  },
  {
    name: 'createdAt',
    type: 'timestamp',
    default: 'now()',
  },
  {
    name: 'updatedAt',
    type: 'timestamp',
    default: 'now()',
  },
  {
    name: 'deletedAt',
    type: 'timestamp',
    isNullable: true,
  },
];

export const TABLES = {
  user: 'user',
  venue: 'venue',
  pitch: 'pitch',
  booking: 'booking',
  pitchCategory: 'pitch-category',
  rating: 'rating',
  forgottenPassword: 'forgotten-password',
  notification: 'notification',
};
