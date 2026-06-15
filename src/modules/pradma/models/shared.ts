export const DOCUMENT_TYPE = {
  CC: 'CC',
  CE: 'CE',
  NIT: 'NIT',
  PASAPORTE: 'PASAPORTE'
} as const;
export type DocumentType = (typeof DOCUMENT_TYPE)[keyof typeof DOCUMENT_TYPE];

export const USER_ROLE = {
  ADMIN: 'ADMIN',
  OPERATOR: 'OPERATOR'
} as const;
export type UserRole = (typeof USER_ROLE)[keyof typeof USER_ROLE];
