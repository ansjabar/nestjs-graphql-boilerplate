import {
  ApolloServerPlugin,
  GraphQLRequestContextDidEncounterErrors,
  GraphQLRequestListener,
} from '@apollo/server';
import { Plugin } from '@nestjs/apollo';
import { HttpStatus, Injectable } from '@nestjs/common';
import { UserService } from '../../modules/user/services/user.service';
import { AppConfigClass } from '../../config/classes';
import Bugsnag from '@bugsnag/js';
import { GraphQLError } from 'graphql';

@Plugin()
@Injectable()
export class LoggingPlugin implements ApolloServerPlugin {
  private readonly errorTypesToIgnore = ['Entity'];

  constructor(
    private readonly userService: UserService,
    private readonly configs: AppConfigClass,
  ) {}

  async requestDidStart(): Promise<GraphQLRequestListener<any>> {
    // eslint-disable-next-line @typescript-eslint/no-this-alias
    const thisClass = this;
    return {
      async didEncounterErrors(
        requestContext: GraphQLRequestContextDidEncounterErrors<any>,
      ): Promise<void> {
        if (!Bugsnag.isStarted()) return;

        let userAdded = false;

        for (const error of requestContext.errors) {
          try {
            if (thisClass.shouldLogThisError(error)) {
              if (!userAdded) {
                userAdded = true;
                Bugsnag.addMetadata(
                  'request',
                  requestContext.request.http.body,
                );
                Bugsnag.notify(error.originalError);
              }
            }
          } catch (error) {}
        }
      },
    };
  }

  private shouldLogThisError(error: GraphQLError): boolean {
    let statusCode: number;
    try {
      statusCode = error?.extensions?.http['status'];
    } catch (err) {
      try {
        statusCode = error.originalError['response']['statusCode'];
      } catch (err) {
        statusCode = HttpStatus.INTERNAL_SERVER_ERROR;
      }
    }
    if (statusCode !== HttpStatus.INTERNAL_SERVER_ERROR) return false;

    for (const e in this.errorTypesToIgnore) {
      if (error.originalError.name.startsWith(e)) {
        return false;
      }
      return true;
    }
    return true;
  }
}
