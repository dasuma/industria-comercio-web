export const DOCUMENT_TYPE = {
  CC: 'CC',
  NIT: 'NIT',
  CE: 'CE',
  TI: 'TI',
  PP: 'PP'
} as const;
export type DocumentType = (typeof DOCUMENT_TYPE)[keyof typeof DOCUMENT_TYPE];

export const USER_ROLE = {
  ADMIN: 'ADMIN',
  USER: 'USER'
} as const;
export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
