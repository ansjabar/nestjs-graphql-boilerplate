import { Injectable } from '@nestjs/common';
import { UserEntity } from '../../user/entities/user.entity';
@Injectable()
export class AccessTokenStrategy {
  async validate(user: UserEntity): Promise<UserEntity> {
    return user;
  }
}
