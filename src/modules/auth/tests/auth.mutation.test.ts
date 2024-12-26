import { HttpStatus } from '@nestjs/common';
import {
  createAccount,
  fakeEmail,
  googleAuth,
  tokenService,
} from '../../../../test/setup';
import { TokenTypes } from '../../../common/@types';
import { UserEntity as UE, UserEntity } from '../../user/entities/user.entity';
import { LogoutDeviceTypes } from '../@types';
import { LoginResponseDto as LoginRes, RegisterResponseDto } from '../dtos';
import { GqlErrorResponseType as GqlErr } from './../../../common/@types';
import { requests as UserReqs } from './../../user/tests/gql-requests';
import { mockedGoogleUser, requests } from './gql-requests';

describe('Auth', () => {
  describe('Login', () => {
    const email = fakeEmail();
    beforeAll(async () => {
      await requests().register({
        email,
        password: 'abCD@1234',
        name: 'John Doe',
      });
    });

    it('should throw error for invalid email', async () => {
      const response = await requests().login<GqlErr>({
        email: 'invalid-email',
        password: 'ab',
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.validationErrors).toContain('validations.isEmail.single');
    });

    it('should not login with invalid creds', async () => {
      const response = await requests().login<GqlErr>({
        email,
        password: 'abCD@12344',
      });

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });

    it('should login', async () => {
      const response = await requests().login<LoginRes>({
        email,
        password: 'abCD@1234',
      });

      expect(response.accessToken).toBeDefined();
      expect(response.user).toMatchObject({
        name: 'John Doe',
        email,
      });
    });

    it('should login with google, with token', async () => {
      const email = 'ans.jabar.fake.account.1@gmail.com';
      jest
        .spyOn(googleAuth, 'googleUserFromAccessToken')
        .mockResolvedValue(mockedGoogleUser(email));

      const response = await requests().loginWithGoogle<LoginRes>({
        token: 'some-token',
      });
      expect(response.accessToken).toBeDefined();
      expect(response.user.email).toBe(email);
    });

    it('should login with google, with code', async () => {
      const email = 'ans.jabar.fake.account.2@gmail.com';
      jest
        .spyOn(googleAuth, 'googleUserFromCode')
        .mockResolvedValue(mockedGoogleUser(email));

      const response = await requests().loginWithGoogle<LoginRes>({
        code: 'some-token',
      });
      expect(response.accessToken).toBeDefined();
      expect(response.user.email).toBe(email);
    });
  });

  describe('Register', () => {
    const email = fakeEmail();
    const passwordError = 'validations.password';

    it('should throw error for invalid email', async () => {
      const response = await requests().register<GqlErr>({
        email: 'invalid-email',
        password: 'ab',
        name: 'John Doe',
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.validationErrors).toContain('validations.isEmail.single');
    });

    it('should throw error if password does not have at least one upper case', async () => {
      const response = await requests().register<GqlErr>({
        email,
        password: 'abcd@1234',
        name: 'John Doe',
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.validationErrors[0]).toBe(passwordError);
    });

    it('should throw error if password does not have at least one lower case', async () => {
      const response = await requests().register<GqlErr>({
        email,
        password: 'ABCD@1234',
        name: 'John Doe',
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.validationErrors[0]).toBe(passwordError);
    });

    it('should throw error if password does not have at least one number', async () => {
      const response = await requests().register<GqlErr>({
        email,
        password: 'abCD@abcd',
        name: 'John Doe',
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.validationErrors[0]).toBe(passwordError);
    });

    it('should throw error if password is less than 8 characters', async () => {
      const response = await requests().register<GqlErr>({
        email,
        password: 'abCD@1',
        name: 'John Doe',
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.validationErrors[0]).toBe(passwordError);
    });

    it('should throw error if password does not have at least one special character', async () => {
      const response = await requests().register<GqlErr>({
        email,
        password: 'abCD1234',
        name: 'John Doe',
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.validationErrors[0]).toBe(passwordError);
    });

    it('should throw error if name is less than 3 characters', async () => {
      const response = await requests().register<GqlErr>({
        email,
        password: 'abCD@1234',
        name: 'JD',
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.validationErrors[0]).toContain(
        'validations.minLength.single',
      );
    });

    it('should register', async () => {
      const response = await requests().register<RegisterResponseDto>({
        email,
        password: 'abCD@1234',
        name: 'John Doe',
      });

      expect(response.user).toMatchObject({
        name: 'John Doe',
        email,
      });
    });

    it('should not register if email is already taken', async () => {
      const response = await requests().register<GqlErr>({
        email,
        password: 'abCD@1234',
        name: 'John Doe',
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.validationErrors).toContain(
        'validations.notExists.single',
      );
    });
  });

  describe('Password', () => {
    let user: UE;
    const email = fakeEmail();

    beforeAll(async () => {
      ({ user } = await createAccount(email));
    });

    describe('forgotPassword', () => {
      it('should throw error if email does not exist', async () => {
        const response = await requests().forgotPassword<GqlErr>({
          email: fakeEmail(),
        });

        expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
        expect(response.validationErrors).toContain(
          'validations.exists.single',
        );
      });

      it('should requests forgot password', async () => {
        const response = await requests().forgotPassword({ email });

        expect(response).toBe(true);
      });

      it('should not requests forgot password immediately', async () => {
        const response = await requests().forgotPassword<GqlErr>({
          email,
        });

        expect(response.statusCode).toBe(HttpStatus.FORBIDDEN);
        expect(response.message).toBe('errors.email.waitToSend');
      });
    });

    describe('resetPassword', () => {
      it('should not reset with expired token', async () => {
        const token = await tokenService.sign(
          {
            payload: { userId: user.id },
            type: TokenTypes.PASSWORD_RESET_LINK,
          },
          '-1h',
        );
        const response = await requests().resetPassword<GqlErr>({
          token,
          password: 'abCD@12345',
        });

        expect(response.statusCode).toBe(HttpStatus.FORBIDDEN);
        expect(response.message).toBe('errors.token.expired');
      });

      it('should not verify email with invalid token', async () => {
        const response = await requests().resetPassword<GqlErr>({
          token: 'someinvalidtoken',
          password: 'abCD@12345',
        });

        expect(response.statusCode).toBe(HttpStatus.FORBIDDEN);
        expect(response.message).toBe('errors.token.invalid');
      });

      it('should reset password', async () => {
        const token = await tokenService.sign({
          payload: { userId: user.id },
          type: TokenTypes.PASSWORD_RESET_LINK,
        });
        const response = await requests().resetPassword<boolean>({
          token,
          password: 'abCD@12345',
        });

        expect(response).toBe(true);
      });

      it('should not reset with already used token', async () => {
        const token = await tokenService.sign({
          payload: { userId: user.id },
          type: TokenTypes.PASSWORD_RESET_LINK,
        });
        await requests().resetPassword({ token, password: 'abCD@12345' });

        const response = await requests().resetPassword<GqlErr>({
          token,
          password: 'abCD@123456',
        });

        expect(response.statusCode).toBe(HttpStatus.FORBIDDEN);
        expect(response.message).toBe('errors.token.invalid');
      });
    });

    describe('changePassword', () => {
      let accessToken: string;
      beforeAll(async () => {
        accessToken = (await createAccount(fakeEmail())).accessToken;
      });

      it('should not change the password if old password is incorrect', async () => {
        const response = await requests({
          accessToken,
        }).changePassword<GqlErr>({
          oldPassword: 'wrong',
          newPassword: 'abCD@1234',
        });

        expect(response.message).toBe('errors.password.incorrect');
      });

      it('should not change the password if old and new password are same', async () => {
        const response = await requests({
          accessToken,
        }).changePassword<GqlErr>({
          oldPassword: 'abCD@1234',
          newPassword: 'abCD@1234',
        });

        expect(response.message).toBe('errors.password.cannotBeSame');
      });

      it('should change the password', async () => {
        const response = await requests({
          accessToken,
        }).changePassword<boolean>({
          oldPassword: 'abCD@1234',
          newPassword: 'abCD@12345',
        });

        expect(response).toBeTruthy();
      });
    });
  });

  describe('Logout', () => {
    const email = fakeEmail();
    beforeAll(async () => {
      await createAccount(email);
    });
    it('should logout from current device', async () => {
      const token1 = (
        await requests().login<LoginRes>({
          email,
          password: 'abCD@1234',
        })
      ).accessToken.token;

      const token2 = (
        await requests().login<LoginRes>({
          email,
          password: 'abCD@1234',
        })
      ).accessToken.token;

      const a = await requests({
        accessToken: token1,
        enumPaths: ['filters.device'],
      }).logout({
        device: LogoutDeviceTypes.THIS,
      });

      const userWIthToken1 = await UserReqs({
        accessToken: token1,
      }).profile<GqlErr>();
      expect(userWIthToken1.statusCode).toBe(HttpStatus.UNAUTHORIZED);

      const userWIthToken2 = await UserReqs({
        accessToken: token2,
      }).profile<UserEntity>();
      expect(userWIthToken2.email).toBe(email);
    });

    it('should logout from all device', async () => {
      const token1 = (
        await requests().login<LoginRes>({
          email,
          password: 'abCD@1234',
        })
      ).accessToken.token;

      const token2 = (
        await requests().login<LoginRes>({
          email,
          password: 'abCD@1234',
        })
      ).accessToken.token;

      const a = await requests({
        accessToken: token1,
        enumPaths: ['filters.device'],
      }).logout({
        device: LogoutDeviceTypes.ALL,
      });

      const userWIthToken1 = await UserReqs({
        accessToken: token1,
      }).profile<GqlErr>();
      expect(userWIthToken1.statusCode).toBe(HttpStatus.UNAUTHORIZED);

      const userWIthToken2 = await UserReqs({
        accessToken: token2,
      }).profile<GqlErr>();
      expect(userWIthToken2.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
  });
});
