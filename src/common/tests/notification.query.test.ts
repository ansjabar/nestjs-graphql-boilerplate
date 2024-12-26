import { createAccount, fakeEmail } from '../../../test/setup';
import { NotificationEntity } from '../entities/notification.entity';
import { addNotification, requests } from './notification-gql-requests';

describe('User', () => {
  describe('get', () => {
    it('should return a notification', async () => {
      const { accessToken, user } = await createAccount(fakeEmail());
      const added = await addNotification({ userId: user.id });

      const notification = await requests({ accessToken }).get({
        id: added.id,
      });

      expect(notification).toMatchObject(added);
    });
  });

  describe('all', () => {
    it('should return notifications', async () => {
      const notifictions: Partial<NotificationEntity>[] = [];
      const { accessToken, user } = await createAccount(fakeEmail());
      notifictions.push(await addNotification({ userId: user.id }));
      notifictions.push(await addNotification({ userId: user.id }));

      const list = await requests({ accessToken }).all(null, null);

      expect(list).toMatchObject(notifictions);
    });

    it('should return only a users notifications', async () => {
      const notifictions: Partial<NotificationEntity>[] = [];
      const { user } = await createAccount(fakeEmail());
      notifictions.push(await addNotification({ userId: user.id }));
      notifictions.push(await addNotification({ userId: user.id }));

      const list = await requests({
        accessToken: (await createAccount(fakeEmail())).accessToken,
      }).all(null, null);

      expect(list).toHaveLength(0);
    });

    it('should return notifications with pagination', async () => {
      const { accessToken, user } = await createAccount(fakeEmail());
      await addNotification({ userId: user.id });
      const notifiction = await addNotification({ userId: user.id });
      await addNotification({ userId: user.id });

      const list = await requests({ accessToken }).all(null, {
        page: 2,
        perPage: 1,
      });

      expect(list).toMatchObject([notifiction]);
    });

    it('should return notifications with filtesr (read)', async () => {
      const { accessToken, user } = await createAccount(fakeEmail());
      await addNotification({ userId: user.id });
      const notifiction = await addNotification({
        userId: user.id,
        readAt: new Date(),
      } as any);
      await addNotification({ userId: user.id });

      const list = await requests({ accessToken }).all({ read: true }, null);

      expect(list).toMatchObject([notifiction]);
    });

    it('should return notifications with filtesr (unread)', async () => {
      const notifictions: Partial<NotificationEntity>[] = [];
      const { accessToken, user } = await createAccount(fakeEmail());
      notifictions.push(await addNotification({ userId: user.id }));
      await addNotification({ userId: user.id, readAt: new Date() } as any);
      notifictions.push(await addNotification({ userId: user.id }));

      const list = await requests({ accessToken }).all({ read: false }, null);

      expect(list).toMatchObject(notifictions);
    });
  });
});
