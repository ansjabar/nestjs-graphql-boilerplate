import { HttpStatus } from '@nestjs/common';

export interface GqlContext {
  req: Request;
  res: Response;
}

export type GqlErrorResponseType = {
  message: string;
  statusCode: HttpStatus;
  validationErrors?: string[];
  stacktrace: object;
};
