import { CommonColumns } from '../../../common/@types';

export enum UserModuleTables {
  USERS = 'users',
}

export enum UsersColumns {
  ID = CommonColumns.ID,
  EMAIL = 'email',
  NAME = 'name',
  PASSWORD = 'password',
  EMAIL_VERIFIED_AT = 'emailVerifiedAt',
  LOCALE = 'locale',
  SOCIAL_LOGIN_PROVIDER = 'socialLoginProvider',
  CREATED_AT = CommonColumns.CREATED_AT,
  UPDATED_AT = CommonColumns.UPDATED_AT,
}
