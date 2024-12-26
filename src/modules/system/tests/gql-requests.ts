import { AdditionalArgs, gqlRequest } from '../../../../test/setup';

export type RequestTypes = {
  locales: <T>() => Promise<T>;
};

export const requests = (additionalArgs?: AdditionalArgs): RequestTypes => {
  return {
    locales: async <T>() => {
      return await gqlRequest<T>({
        requestPath: 'system.locales',
        query: { __args: {}, name: true, title: true },
        ...additionalArgs,
      });
    },
  };
};
