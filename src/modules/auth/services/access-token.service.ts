import { Injectable, NotFoundException } from '@nestjs/common';
import { Cron, CronExpression } from '@nestjs/schedule';
import { LessThan, MoreThan, Not } from 'typeorm';
import {
  nowInSeconds,
  randomAlphaNumericString,
} from '../../../common/helpers';
import { AppConfigClass } from '../../../config/classes';
import { AccessTokenEntity } from '../entities/access-token.entity';
import { AccessTokenRepository } from '../repositories/access-token.repository';
@Injectable()
export class AccessTokenService {
  constructor(
    private readonly repository: AccessTokenRepository,
    private readonly configs: AppConfigClass,
  ) {}

  async create(userId: number): Promise<AccessTokenEntity> {
    const token = randomAlphaNumericString(64);
    return await this.repository.createAndSave({
      userId,
      token,
      expiresAt: this.expiredAt(),
    });
  }

  async extendExpiry(token: string): Promise<AccessTokenEntity> {
    const entity = await this.repository.findOneBy({
      token,
      expiresAt: MoreThan(nowInSeconds()),
    });
    if (!entity) {
      throw new NotFoundException('Token not found');
    }

    entity.expiresAt = this.expiredAt();

    await this.repository.save(entity);

    return entity;
  }

  private expiredAt(): number {
    const expiry = this.configs.accessTokenConfigs.expiry * 60;
    return nowInSeconds() + expiry;
  }

  async logoutAllTokens(userId: number) {
    const tokenEntities = await this.repository.findManyBy({ userId });
    const tokens = tokenEntities.map((t) => t.token);

    if (tokens.length) {
      await this.repository.removeMany(tokenEntities);
    }
  }

  async logoutToken(token: string) {
    const tokenEntity = await this.repository.findOneBy({ token });
    await this.repository.remove(tokenEntity);
  }

  async logoutAllTokenExceptToken(token: string) {
    const tokenEntity = await this.repository.findOneBy({ token });
    const tokenEntities = await this.repository.findManyBy({
      userId: tokenEntity.userId,
      token: Not(token),
    });

    const tokens = tokenEntities.map((t) => t.token);
    if (tokens.length) {
      await this.repository.removeMany(tokenEntities);
    }
  }

  @Cron(CronExpression.EVERY_DAY_AT_MIDNIGHT)
  async deleteExpiredTokens() {
    await this.repository.delete({ expiresAt: LessThan(nowInSeconds()) });
  }
}
