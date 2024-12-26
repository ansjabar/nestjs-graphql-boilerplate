import { AdditionalArgs, gqlRequest } from '../../../../test/setup';
import { EmailDto } from '../../../common/dtos';
import { ChangePasswordRequestDto } from '../../user/dtos/update.dto';
import { gqlUserResponseObj } from '../../user/tests/gql-requests';
import {
  GoogleLoginRequestDto,
  LoginRequestDto,
  PasswordForgotRequestDto,
  PasswordResetRequestDto,
  RegisterRequestDto,
} from '../dtos';
import { LogoutRequestDto } from '../dtos/logout.dto';

export type RequestTypes = {
  register: <T>(payload: RegisterRequestDto) => Promise<T>;
  login: <T>(payload: LoginRequestDto) => Promise<T>;
  forgotPassword: <T>(payload: PasswordForgotRequestDto) => Promise<T>;
  resetPassword: <T>(payload: PasswordResetRequestDto) => Promise<T>;
  isRegistered: <T>(filters: EmailDto) => Promise<T>;
  changePassword: <T>(payload: ChangePasswordRequestDto) => Promise<T>;
  logout: <T>(filters: LogoutRequestDto) => Promise<T>;
  loginWithGoogle: <T>(payload: GoogleLoginRequestDto) => Promise<T>;
};

export const requests = (additionalArgs?: AdditionalArgs): RequestTypes => {
  return {
    register: async <T>(payload: RegisterRequestDto) => {
      return await gqlRequest<T>({
        requestPath: 'auth.register',
        mutation: {
          __args: { payload },
          accessToken: { token: true, expiresAt: true },
          user: { ...gqlUserResponseObj },
        },
        ...additionalArgs,
      });
    },

    login: async <T>(payload: LoginRequestDto) => {
      return await gqlRequest<T>({
        requestPath: 'auth.login',
        mutation: {
          __args: { payload },
          accessToken: { token: true, expiresAt: true },
          user: { ...gqlUserResponseObj },
        },
        ...additionalArgs,
      });
    },

    forgotPassword: async <T>(payload: PasswordForgotRequestDto) => {
      return await gqlRequest<T>({
        requestPath: 'auth.forgotPassword',
        mutation: { __args: { payload } },
        ...additionalArgs,
      });
    },

    resetPassword: async <T>(payload: PasswordResetRequestDto) => {
      return await gqlRequest<T>({
        requestPath: 'auth.resetPassword',
        mutation: { __args: { payload } },
        ...additionalArgs,
      });
    },

    isRegistered: async <T>(filters: EmailDto) => {
      return await gqlRequest<T>({
        requestPath: 'auth.isRegistered',
        query: { __args: { filters } },
        ...additionalArgs,
      });
    },

    changePassword: async <T>(payload: ChangePasswordRequestDto) => {
      return await gqlRequest<T>({
        requestPath: 'auth.changePassword',
        mutation: { __args: { payload } },
        ...additionalArgs,
      });
    },

    logout: async <T>(filters: LogoutRequestDto) => {
      return await gqlRequest<T>({
        requestPath: 'auth.logout',
        mutation: { __args: { filters } },
        ...additionalArgs,
      });
    },

    loginWithGoogle: async <T>(payload: GoogleLoginRequestDto) => {
      return await gqlRequest<T>({
        requestPath: 'auth.loginWithGoogle',
        mutation: {
          __args: { payload },
          accessToken: { token: true, expiresAt: true },
          user: { ...gqlUserResponseObj },
        },
        ...additionalArgs,
      });
    },
  };
};

export const mockedGoogleUser = (email: string) => {
  return {
    resourceName: 'people/aabbccdd',
    etag: '%EgcBAgkuNz0+GgQBAk1DTT0=',
    names: [
      {
        metadata: {
          primary: true,
          source: {
            type: 'PROFILE',
            id: 'aabbccdd',
          },
          sourcePrimary: true,
        },
        displayName: 'Ans Jabar',
        familyName: 'Jabar',
        givenName: 'Ans',
        displayNameLastFirst: 'Jabar, Ans',
        unstructuredName: 'Ans Jabar',
      },
    ],
    emailAddresses: [
      {
        metadata: {
          primary: true,
          verified: true,
          source: {
            type: 'ACCOUNT',
            id: 'aabbccdd',
          },
          sourcePrimary: true,
        },
        value: email,
      },
    ],
  };
};
