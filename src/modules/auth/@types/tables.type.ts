import { CommonColumns } from '../../../common/@types';

export enum AuthModuleTables {
  ACCESS_TOKENS = 'accessTokens',
}

export enum AccessTokensColumns {
  ID = CommonColumns.ID,
  USER_ID = 'userId',
  TOKEN = 'token',
  TOKEN_TYPE = 'tokenType',
  EXPIRES_AT = 'expiresAt',
  CREATED_AT = CommonColumns.CREATED_AT,
}

export enum AccessTokensTypes {
  ACCESS = 'ACCESS',
}
