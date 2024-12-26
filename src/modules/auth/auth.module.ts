import { Global, Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CommonModule } from './../../common/common.module';
import { UserModule } from './../user/user.module';
import { AccessTokenEntity } from './entities/access-token.entity';
import { AccessTokenRepository } from './repositories/access-token.repository';
import { AuthMutationResolver } from './resolvers/auth.mutation.resolver';
import { AuthQueryResolver } from './resolvers/auth.query.resolver';
import { AccessTokenService } from './services/access-token.service';
import { AuthService } from './services/auth.service';
import { PasswordService } from './services/password.service';
import { GoogleAuth } from './social-auth/google-auth';
import { AccessTokenStrategy } from './strategies/access-token.strategy';

@Global()
@Module({
  imports: [
    PassportModule,
    UserModule,
    CommonModule,
    TypeOrmModule.forFeature([AccessTokenEntity]),
  ],
  providers: [
    GoogleAuth,
    AuthService,
    PasswordService,
    AuthMutationResolver,
    AuthQueryResolver,
    AccessTokenStrategy,
    AccessTokenRepository,
    AccessTokenService,
  ],
  exports: [AccessTokenService],
})
export class AuthModule {}
