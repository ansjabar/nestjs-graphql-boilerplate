export enum TokenTypes {
  PASSWORD_RESET_LINK = 'PASSWORD_RESET_LINK',
  EMAIL_VERIFY_LINK = 'EMAIL_VERIFY_LINK',
}

export type TokenSignType = {
  type: TokenTypes;
  payload: any;
  exp?: number;
};

export type TokenSignedType = {
  type: TokenTypes;
  payload: any;
  exp: number;
  iat: number;
};
