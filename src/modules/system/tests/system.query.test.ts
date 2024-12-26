import { LocaleEntity } from '../../../common/entities/locale.entity';
import { requests } from './gql-requests';

describe('System', () => {
  describe('locales', () => {
    it('should return all active locales', async () => {
      const locales = await requests().locales<LocaleEntity[]>();
      expect(locales.length).toBeGreaterThanOrEqual(1);
    });
  });
});
