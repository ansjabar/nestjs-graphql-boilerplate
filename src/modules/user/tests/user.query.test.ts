import { createAccount, fakeEmail } from '../../../../test/setup';
import { UserEntity } from '../entities/user.entity';
import { requests } from './gql-requests';

describe('User', () => {
  describe('profile', () => {
    let accessToken: string;
    const email = fakeEmail();

    beforeAll(async () => {
      ({ accessToken } = await createAccount(email));
    });

    it('should return profile', async () => {
      const response = await requests({ accessToken }).profile<UserEntity>();

      expect(response.name).toBe('John Doe');
      expect(response.email).toBe(email);
    });
  });
});
