import { ApolloDriverConfig } from '@nestjs/apollo';
import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import { GqlOptionsFactory } from '@nestjs/graphql';
import GraphQLJSON from 'graphql-type-json';
import { TranslationService } from '../../common/services/translation.service';
import { AccessTokenService } from '../../modules/auth/services/access-token.service';
import { AppConfigClass } from './app-config.class';

@Injectable()
export class GqlModuleClass implements GqlOptionsFactory {
  constructor(
    private readonly configs: AppConfigClass,
    private readonly t: TranslationService,
    private readonly accessTokenService: AccessTokenService,
  ) {}

  createGqlOptions(): ApolloDriverConfig {
    return {
      installSubscriptionHandlers: true,
      context: ({ req, res }: { req: Request; res: Response }) => ({
        req,
        res,
      }),
      resolvers: { JSON: GraphQLJSON },
      playground: this.configs.appConfigs.gqlPlayground,
      autoSchemaFile: true,
      sortSchema: true,
      includeStacktraceInErrorResponses: true,
      subscriptions: {
        'subscriptions-transport-ws': {
          onConnect: async (connectionParams) => {
            const authToken = connectionParams.Authorization;
            try {
              const { user } = await this.accessTokenService.extendExpiry(
                authToken.replace('Bearer ', ''),
              );
              return user;
            } catch (error) {
              throw new UnauthorizedException(
                this.t.translate('errors.auth.unauthorized'),
              );
            }
          },
        },
      },
      formatError: (err) => {
        const message = err.message;

        const statusCode = message.includes('ThrottlerException')
          ? HttpStatus.TOO_MANY_REQUESTS
          : (err?.extensions?.originalError as any)?.statusCode ||
            HttpStatus.INTERNAL_SERVER_ERROR;

        let validationErrors =
          statusCode === HttpStatus.BAD_REQUEST
            ? Array.isArray((err.extensions.originalError as any).message)
              ? (err.extensions.originalError as any).message
              : [(err.extensions.originalError as any).message]
            : [];

        validationErrors = validationErrors.map((validationError) => {
          return this.t.translateValidationErrors(validationError);
        });

        const fullTrace = (err.extensions.stacktrace as string[]).join('\n');

        const [errorType, ...remainingParts] = fullTrace.split(':');

        let stacktrace = {};

        if (this.configs.appConfigs.debug) {
          stacktrace = remainingParts.join(':').trim();
        }

        return { message, statusCode, validationErrors, errorType, stacktrace };
      },
    };
  }
}
