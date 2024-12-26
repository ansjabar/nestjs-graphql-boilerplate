import { ForbiddenException, Injectable } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { getUnixTime } from 'date-fns';
import * as jwt from 'jsonwebtoken';
import { lowerCase, replace } from 'lodash';
import { LessThan } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';
import { AppConfigClass } from '../../config/classes';
import { TokenSignType, TokenSignedType, TokenTypes } from '../@types';
import { UsedTokenRepository } from '../repositories/used-token.repository';
import { TranslationService } from './translation.service';

@Injectable()
export class UsedTokenService {
  constructor(
    private readonly usedTokenRepository: UsedTokenRepository,
    private readonly configs: AppConfigClass,
    private readonly translationService: TranslationService,
  ) {}

  sign(signPayload: TokenSignType, expiresIn = '1h') {
    return jwt.sign(
      {
        payload: signPayload.payload,
        type: signPayload.type,
        unique: uuidv4(),
      },
      this.configs.appConfigs.key,
      { expiresIn },
    );
  }

  async verify(
    token: string,
    type: TokenTypes,
  ): Promise<TokenSignedType['payload']> {
    try {
      const decoded: TokenSignedType = jwt.verify(
        token,
        this.configs.appConfigs.key,
      ) as TokenSignedType;

      if (decoded.type !== type) {
        throw new ForbiddenException(
          this.translationService.translate('errors.token.invalid', {
            type: this.humanFriendlyType(type),
          }),
        );
      }

      await this.addToUsedTokens(token, decoded);

      return decoded.payload;
    } catch (error) {
      if (error.message === 'jwt expired')
        throw new ForbiddenException(
          this.translationService.translate('errors.token.expired', {
            type: this.humanFriendlyType(type),
          }),
        );
      else
        throw new ForbiddenException(
          this.translationService.translate('errors.token.invalid', {
            type: this.humanFriendlyType(type),
          }),
        );
    }
  }

  private async addToUsedTokens(token: string, decoded: TokenSignedType) {
    await this.usedTokenRepository.createAndSave({
      token,
      type: decoded.type,
      expiresOn: decoded.exp,
    });
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredTokens() {
    await this.usedTokenRepository.delete({
      expiresOn: LessThan(getUnixTime(new Date())),
    });
  }

  private humanFriendlyType(type: TokenTypes) {
    return replace(lowerCase(type), /_/g, ' ');
  }
}
