import { fakeEmail } from '../../../../test/setup';
import { requests } from './gql-requests';

describe('Auth', () => {
  describe('isRegistered', () => {
    it('should return false if email is not already registered', async () => {
      const email = fakeEmail();
      const response = await requests().isRegistered<boolean>({ email });

      expect(response).toBe(false);
    });

    it('should return true if email is already registered', async () => {
      const email = fakeEmail();
      await requests().register({
        email,
        password: 'abCD@1234',
        name: 'John Doe',
      });
      const response = await requests().isRegistered<boolean>({ email });

      expect(response).toBe(true);
    });
  });
});
