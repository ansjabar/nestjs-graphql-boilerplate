import { getUnixTime } from 'date-fns';
import { moduleFixture, tokenService } from '../../../test/setup/jest.setup';
import { TokenTypes } from '../@types';
import { UsedTokenRepository } from '../repositories/used-token.repository';

describe('Token', () => {
  let repository: UsedTokenRepository;
  beforeAll(() => {
    repository = moduleFixture.get<UsedTokenRepository>(UsedTokenRepository);
  });
  it('should delete the expired tokens', async () => {
    const token = 'some-token';
    await repository.save(
      repository.create({
        token: 'some-token',
        type: TokenTypes.EMAIL_VERIFY_LINK,
        expiresOn: getUnixTime(new Date()) - 100,
      }),
    );

    const r = await repository.findOneBy({ token });

    expect(r.token).toBe(token);

    await tokenService.deleteExpiredTokens();

    const d = await repository.findOneBy({ token });

    expect(d).toBeNull();
  });
});
