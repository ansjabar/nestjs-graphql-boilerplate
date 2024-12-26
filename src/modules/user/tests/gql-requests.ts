import { AdditionalArgs, gqlRequest } from '../../../../test/setup';
import { DeleteRequestDto } from '../dtos/delete.dto';
import { EmailVerificationRequestDto } from '../dtos/email-verify.dto';
import { UpdateRequestDto } from '../dtos/update.dto';

export type RequestTypes = {
  update: <T>(payload: UpdateRequestDto) => Promise<T>;
  profile: <T>() => Promise<T>;
  delete: <T>(payload: DeleteRequestDto) => Promise<T>;
  verifyEmail: <T>(payload: EmailVerificationRequestDto) => Promise<T>;
  resendVerificationEmail: <T>() => Promise<T>;
};

export const requests = (additionalArgs?: AdditionalArgs): RequestTypes => {
  return {
    update: async <T>(payload: UpdateRequestDto) => {
      return await gqlRequest<T>({
        requestPath: 'user.update',
        mutation: { __args: { payload }, ...gqlUserResponseObj },
        ...additionalArgs,
      });
    },

    profile: async <T>() => {
      return await gqlRequest<T>({
        requestPath: 'user.profile',
        query: { __args: {}, ...gqlUserResponseObj },
        ...additionalArgs,
      });
    },

    delete: async <T>(payload: DeleteRequestDto) => {
      return await gqlRequest<T>({
        requestPath: 'user.delete',
        mutation: { __args: { payload } },
        ...additionalArgs,
      });
    },

    verifyEmail: async <T>(payload: EmailVerificationRequestDto) => {
      return await gqlRequest<T>({
        requestPath: 'user.verifyEmail',
        mutation: { __args: { payload } },
        ...additionalArgs,
      });
    },

    resendVerificationEmail: async <T>() => {
      return await gqlRequest<T>({
        requestPath: 'user.resendVerificationEmail',
        mutation: { __args: {} },
        ...additionalArgs,
      });
    },
  };
};

export const gqlUserResponseObj = {
  id: true,
  email: true,
  name: true,
  locale: true,
  emailVerifiedAt: true,
  avatar: {
    id: true,
    file: true,
    metadata: true,
  },
};
