import { translationService } from '../../../../test/setup';
import { DiskFactory } from '../disks';

describe('File', () => {
  describe('DiskFactory', () => {
    it('should throw error if disk is not acailable', () => {
      expect(() =>
        new DiskFactory(translationService).make('none-existing' as any),
      ).toThrow('errors.disk.notCOnfigured');
    });
  });
});
