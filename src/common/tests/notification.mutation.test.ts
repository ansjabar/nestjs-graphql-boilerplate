import { createAccount, fakeEmail } from '../../../test/setup';
import { addNotification, requests } from './notification-gql-requests';

describe('User', () => {
  describe('read', () => {
    it('should mark a notification as read', async () => {
      const { accessToken, user } = await createAccount(fakeEmail());
      const notification = await addNotification({ userId: user.id });

      const read = await requests({ accessToken }).read<boolean>({
        id: notification.id,
      });

      expect(read).toBeTruthy();

      const list = await requests({ accessToken }).all({ read: true }, null);

      expect(list).toMatchObject([notification]);
    });
  });
});
