import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { GqlExecutionContext } from '@nestjs/graphql';
import { extractTokenFromHeaders, isResolver } from '../../../common/helpers';
import { TranslationService } from '../../../common/services/translation.service';
import { UserService } from '../../user';
import { AccessTokenService } from '../services/access-token.service';

@Injectable()
export class AccessTokenGuard implements CanActivate {
  constructor(
    private readonly reflector: Reflector,
    private readonly accessTokenService: AccessTokenService,
    private readonly t: TranslationService,
    private readonly userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext) {
    const isSemiPublicResolver = isResolver(
      context,
      this.reflector,
    ).semiPublic();

    if (isResolver(context, this.reflector).public()) {
      return true;
    }

    const ctx = GqlExecutionContext.create(context);

    const request = ctx.getContext().req;

    if (!request) return true;

    const bearerToken = extractTokenFromHeaders(request?.headers);

    if (!bearerToken && !isSemiPublicResolver) {
      throw new UnauthorizedException(
        this.t.translate('errors.auth.unauthorized'),
      );
    }

    try {
      const accessToken = await this.accessTokenService.extendExpiry(
        bearerToken,
      );

      request.user = this.userService.profile(accessToken.user);
    } catch (error) {
      if (isSemiPublicResolver) {
        return true;
      }
      throw new UnauthorizedException(
        this.t.translate('errors.auth.unauthorized'),
      );
    }

    return true;
  }
}
