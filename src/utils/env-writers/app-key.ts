import { randomAlphaNumericString } from '../../common/helpers';
import { setEnvValue } from './write.env';

(async () => {
  setEnvValue('APP_KEY', await randomAlphaNumericString());
})();
