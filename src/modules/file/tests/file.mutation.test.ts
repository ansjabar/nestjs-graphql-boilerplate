import { HttpStatus } from '@nestjs/common';
import { createAccount, fakeEmail, fileService } from '../../../../test/setup';
import { GqlErrorResponseType } from '../../../common/@types';
import { UserEntity } from '../../user/entities/user.entity';
import { FileEntity } from '../entities/file.entity';
import { upload } from './gql-requests';

describe('File', () => {
  let accessToken: string;
  let user: UserEntity;
  beforeAll(async () => {
    ({ accessToken, user } = await createAccount(fakeEmail()));
  });

  it('should throw unauthorized when not authenticated', async () => {
    const response = await upload<GqlErrorResponseType>('invalid-token', [
      'dummy.png',
    ]);

    expect(response.statusCode).toBe(HttpStatus.UNAUTHORIZED);
  });

  it('should upload single file', async () => {
    const response = await upload<FileEntity[]>(accessToken, ['dummy.png']);

    expect(response[0]).toBeDefined();
  });

  it('should upload multiple files', async () => {
    const response = await upload(accessToken, ['dummy.png', 'dummy.pdf']);

    expect(response[0]).toBeDefined();
    expect(response[0].name).toBe('dummy.png');
    expect(response[1]).toBeDefined();
    expect(response[1].name).toBe('dummy.pdf');
  });

  it('should not assign avatar if file does not exist', async () => {
    await expect(
      fileService.assignFile([1122], {
        entity: UserEntity.name,
        entityId: user.id,
        fileType: 'some-file' as any,
        userId: user.id,
      }),
    ).rejects.toThrow('errors.file.notFoundOnAssign');
  });
});
