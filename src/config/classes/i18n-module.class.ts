import {
  AcceptLanguageResolver,
  HeaderResolver,
  QueryResolver,
} from 'nestjs-i18n';
import { AppConfigClass } from './app-config.class';
import { join } from 'path';

export class I18nModuleClass {
  static options() {
    return {
      useFactory: (configs: AppConfigClass) => ({
        fallbackLanguage: configs.appConfigs.defaultLocale,
        loaderOptions: {
          path: join(__dirname, './../../i18n/'),
          watch: true,
        },
      }),
      resolvers: [
        { use: QueryResolver, options: ['lang'] },
        AcceptLanguageResolver,
        new HeaderResolver(['x-lang']),
      ],
      inject: [AppConfigClass],
    };
  }
}
