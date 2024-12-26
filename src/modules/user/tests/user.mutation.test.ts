import { HttpStatus } from '@nestjs/common';
import {
  createAccount,
  fakeEmail,
  fileService,
  tokenService,
} from '../../../../test/setup';
import { TokenTypes } from '../../../common/@types';
import { upload } from '../../file/tests/gql-requests';
import { UserEntity } from '../entities/user.entity';
import { GqlErrorResponseType as GqlErr } from './../../../common/@types';
import { RequestTypes, requests } from './gql-requests';

describe('User', () => {
  describe('update', () => {
    let accessToken: string;
    let user: UserEntity;
    let actions: RequestTypes;

    const emailOne = fakeEmail();
    const emailTwo = fakeEmail();
    const emailThree = fakeEmail();

    beforeAll(async () => {
      ({ user, accessToken } = await createAccount(emailOne));

      actions = requests({ accessToken });
    });

    it('should throw if email is not valid', async () => {
      const response = await actions.update<GqlErr>({
        email: 'update_1@example',
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
    });

    it('should update email', async () => {
      const email = emailTwo;
      const response = await actions.update<UserEntity>({
        email,
      });

      expect(response.email).toEqual(email);
    });

    it('should throw error if email is already taken', async () => {
      await createAccount(emailOne);

      const email = emailOne;
      const response = await actions.update<GqlErr>({
        email,
      });

      expect(response.statusCode).toBe(HttpStatus.CONFLICT);
      expect(response.message).toBe('errors.email.taken');
    });

    it('should update name', async () => {
      const name = 'John Doe Updated';
      const response = await actions.update<UserEntity>({
        name,
      });

      expect(response.name).toEqual(name);
    });

    it('should update locale', async () => {
      const locale = 'en';
      const response = await actions.update<UserEntity>({
        locale,
      });

      expect(response.locale).toEqual(locale);
    });

    it('should not update locale', async () => {
      const locale = 'ur';
      const response = await actions.update<GqlErr>({
        locale,
      });

      expect(response.statusCode).toEqual(HttpStatus.CONFLICT);
    });

    it('should update avatar', async () => {
      const uploadResponse = await upload(accessToken, ['dummy.png']);

      const response = await actions.update<UserEntity>({
        avatar: uploadResponse[0].id,
      });

      expect(response.avatar).toBeDefined();
      expect(response.avatar.id).toBeDefined();
      expect(response.avatar.file).toBeDefined();
      expect(response.avatar.metadata).toBeDefined();
    });

    it('should not assign avatar file to already assigned file', async () => {
      const response = await upload(accessToken, ['dummy.png']);

      await actions.update({ avatar: response[0].id });

      expect(
        async () =>
          await fileService.assignFile([response[0].id], {
            entity: UserEntity.name,
            entityId: user.id,
            fileType: 'some-file' as any,
            userId: user.id,
          }),
      ).rejects.toThrow('errors.file.alreadyAssigned');
    });

    it('should accept if same avatar is being assigned again', async () => {
      const uploadResponse = await upload(accessToken, ['dummy.png']);

      const response = await actions.update<UserEntity>({
        avatar: uploadResponse[0].id,
      });

      expect(response.avatar).toBeDefined();
      expect(response.avatar.id).toBeDefined();
      expect(response.avatar.file).toBeDefined();
      expect(response.avatar.metadata).toBeDefined();

      const updateResponse = await actions.update<UserEntity>({
        avatar: uploadResponse[0].id,
      });

      expect(updateResponse.avatar).toBeDefined();
      expect(updateResponse.avatar.id).toBe(response.avatar.id);
      expect(updateResponse.avatar.file).toBe(response.avatar.file);
      expect(updateResponse.avatar.metadata).toEqual(response.avatar.metadata);
    });

    it('should not update avatar if its not an image', async () => {
      const uploadResponse = await upload(accessToken, ['dummy.pdf']);

      const response = await actions.update<GqlErr>({
        avatar: uploadResponse[0].id,
      });

      expect(response.statusCode).toBe(HttpStatus.UNSUPPORTED_MEDIA_TYPE);
      expect(response.message).toBe('errors.file.mimeConflictOnAssign');
    });

    it('should not update avatar if user does not own it', async () => {
      const regResponse = await createAccount(emailThree);

      const uploadResponse = await upload(regResponse.accessToken, [
        'dummy.png',
      ]);

      const response = await actions.update<GqlErr>({
        avatar: uploadResponse[0].id,
      });

      expect(response.statusCode).toBe(HttpStatus.FORBIDDEN);
      expect(response.message).toBe('errors.file.notOwnByYou');
    });

    it('should remove the avatar', async () => {
      const uploadResponse = await upload(accessToken, ['dummy.png']);

      const response = await actions.update<UserEntity>({
        avatar: uploadResponse[0].id,
      });

      expect(response.avatar).toBeDefined();
      expect(response.avatar.id).toBeDefined();
      expect(response.avatar.file).toBeDefined();
      expect(response.avatar.metadata).toBeDefined();

      const deleteResponse = await actions.update<UserEntity>({
        avatar: null,
      });

      expect(deleteResponse.avatar).toBeNull();
    });
  });

  describe('delete', () => {
    let accessToken: string;
    let actions: RequestTypes;

    beforeAll(async () => {
      ({ accessToken } = await createAccount(fakeEmail()));
      actions = requests({ accessToken });
    });

    it('should not delete profile if password is wrong', async () => {
      const response = await actions.delete<GqlErr>({
        password: 'abcd@123456',
      });

      expect(response.statusCode).toBe(HttpStatus.BAD_REQUEST);
      expect(response.message).toBe('errors.password.incorrect');
    });

    it('should delete profile', async () => {
      const response = await actions.delete<boolean>({
        password: 'abCD@1234',
      });

      expect(response).toBe(true);
    });

    it('should not return profile if account is deleted', async () => {
      const response = await actions.profile<GqlErr>();

      expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
    });
  });

  describe('verifyEmail', () => {
    let accessToken: string;
    let user: UserEntity;
    let actions: RequestTypes;

    beforeAll(async () => {
      ({ user, accessToken } = await createAccount(fakeEmail()));
      actions = requests({ accessToken });
    });

    it('should not verify email with expired token', async () => {
      const token = await tokenService.sign(
        {
          payload: { userId: user.id },
          type: TokenTypes.EMAIL_VERIFY_LINK,
        },
        '-1h',
      );
      const response = await actions.verifyEmail<GqlErr>({
        token,
      });

      expect(response.statusCode).toBe(HttpStatus.FORBIDDEN);
      expect(response.message).toBe('errors.token.expired');
    });

    it('should not verify when token type mismatches', async () => {
      const token = await tokenService.sign({
        payload: { userId: user.id },
        type: TokenTypes.PASSWORD_RESET_LINK,
      });
      const response = await actions.verifyEmail<GqlErr>({
        token,
      });

      expect(response.statusCode).toBe(HttpStatus.FORBIDDEN);
      expect(response.message).toBe('errors.token.invalid');
    });

    it('should not verify when user mismatches', async () => {
      const token = await tokenService.sign({
        payload: { userId: 1122 },
        type: TokenTypes.EMAIL_VERIFY_LINK,
      });
      const response = await actions.verifyEmail<GqlErr>({
        token,
      });

      expect(response.statusCode).toBe(HttpStatus.FORBIDDEN);
      expect(response.message).toBe('errors.token.invalid');
    });

    it('should verify email', async () => {
      const token = await tokenService.sign({
        payload: { userId: user.id },
        type: TokenTypes.EMAIL_VERIFY_LINK,
      });
      const response = await actions.verifyEmail<boolean>({
        token,
      });

      const profileResponse = await actions.profile<UserEntity>();

      expect(response).toBe(true);
      expect(profileResponse.emailVerifiedAt).toBeDefined();
    });

    it('should not verify email if already verified', async () => {
      const token = await tokenService.sign({
        payload: { userId: user.id },
        type: TokenTypes.EMAIL_VERIFY_LINK,
      });
      const response = await actions.verifyEmail<GqlErr>({
        token,
      });

      expect(response.statusCode).toBe(HttpStatus.FORBIDDEN);
      expect(response.message).toBe('errors.email.verified');
    });
  });

  describe('resendVerificationEmail', () => {
    let accessToken: string;
    let user: UserEntity;
    let actions: RequestTypes;

    beforeAll(async () => {
      ({ user, accessToken } = await createAccount(fakeEmail()));
      actions = requests({ accessToken });
    });
    it('should generate email verification token', async () => {
      const response = await actions.resendVerificationEmail<boolean>();

      expect(response).toBe(true);
    });

    it('should not regenerate token because email is already verified', async () => {
      const token = await tokenService.sign({
        payload: { userId: user.id },
        type: TokenTypes.EMAIL_VERIFY_LINK,
      });
      await actions.verifyEmail({ token });

      const response = await actions.resendVerificationEmail<GqlErr>();

      expect(response.statusCode).toBe(HttpStatus.FORBIDDEN);
      expect(response.message).toBe('errors.email.verified');
    });
  });
});
