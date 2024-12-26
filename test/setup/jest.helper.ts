import { EnumType, jsonToGraphQLQuery } from 'json-to-graphql-query';
import { get, isEmpty, set, trim } from 'lodash';
import * as requests from 'supertest';
import { randomAlphabetString } from '../../src/common/helpers';
import { RegisterResponseDto } from '../../src/modules/auth/dtos';
import { UserEntity } from '../../src/modules/user/entities/user.entity';
import { requests as authRequest } from './../../src/modules/auth/tests/gql-requests';
import { app } from './jest.setup';
import { GqlRequestType } from './jest.type';

export const gqlRequest = async <T>(requestObj: GqlRequestType): Promise<T> => {
  const httpRequest = requests(app.getHttpServer()).post('/graphql');

  if (requestObj.accessToken)
    httpRequest.set('Authorization', `Bearer ${requestObj.accessToken}`);

  httpRequest.set('Apollo-Require-Preflight', 'true');

  let gqlObj: object;

  if ('mutation' in requestObj) gqlObj = requestObj.mutation;
  if ('query' in requestObj) gqlObj = requestObj.query;

  gqlObj['__args'] = updateEnums(gqlObj['__args'], requestObj.enumPaths);

  let gqlInput: object;
  if ('mutation' in requestObj)
    gqlInput = { mutation: prepareGqlRequest(requestObj.requestPath, gqlObj) };
  if ('query' in requestObj)
    gqlInput = { query: prepareGqlRequest(requestObj.requestPath, gqlObj) };

  const gql = jsonToGraphQLQuery(gqlInput, { pretty: true });

  if (requestObj.logRequest) console.log(gql, requestObj);

  const response = (await httpRequest.send({ query: gql })).body;

  if (requestObj.logResponse) console.log(JSON.stringify(response));

  return prepareGqlResponse(requestObj.requestPath, response);
};

const updateEnums = (gqlQuery: object, path: string | string[]): object => {
  if (isEmpty(path)) return gqlQuery;
  if (Array.isArray(path)) {
    path.forEach((p) => {
      gqlQuery = updateEnums(gqlQuery, p);
    });
  }

  if (typeof path === 'string') {
    const result = path.split('*', 2);

    if (result.length === 1) {
      const value = get(gqlQuery, path);

      set(gqlQuery, path, new EnumType(value));
      return gqlQuery;
    }
    const firstPart = trim(result[0], '.');
    const secondPart = trim(path.slice(result[0].length + 1), '.');

    const value = get(gqlQuery, firstPart);

    if (!Array.isArray(value)) {
      throw new Error(
        `In enumPaths ${path} the part ${firstPart}.* does not point to an array`,
      );
    }

    value.map((v) => updateEnums(v, secondPart));

    set(gqlQuery, firstPart, value);
  }

  return gqlQuery;
};

const prepareGqlRequest = (requestPath: string, obj: any): any => {
  const keys = requestPath.split('.');
  const result = {};

  keys.reduce((acc, key, index) => {
    acc[key] = index === keys.length - 1 ? obj : {};
    return acc[key];
  }, result);
  return result;
};

export const prepareGqlResponse = (requestPath: string, obj: any): any => {
  if ('errors' in obj) return obj.errors[0];
  const keys = requestPath.split('.');
  let result = obj.data;

  for (const key of keys) {
    result = result[key];
  }
  return result;
};

export const createAccount = async (
  email: string,
): Promise<{ accessToken: string; user: UserEntity }> => {
  const response = await authRequest().register<RegisterResponseDto>({
    email,
    password: 'abCD@1234',
    name: 'John Doe',
  });
  if (!response?.accessToken?.token) {
    console.error(response);
  }
  return {
    accessToken: response.accessToken.token,
    user: response.user,
  };
};

export const fakeEmail = () => {
  return `${randomAlphabetString(15)}@example.com`;
};

export const timeout = () => {
  const millisecondsInSeconds = 1000;
  const millisecondsInMinute = millisecondsInSeconds * 60;
  return {
    seconds: (seconds: number) => seconds * millisecondsInSeconds,
    minutes: (minutes: number) => minutes * millisecondsInMinute,
  };
};
