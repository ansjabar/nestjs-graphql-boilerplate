export type AdditionalArgs = {
  logResponse?: boolean;
  logRequest?: boolean;
  accessToken?: string;
  enumPaths?: string | string[];
};

export type GqlRequestType = ({ query: object } | { mutation: object }) & {
  requestPath: string;
  includeDefaultResponseKeys?: boolean;
} & AdditionalArgs;
