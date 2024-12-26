import { Injectable } from '@nestjs/common';
import { I18nService, TranslateOptions } from 'nestjs-i18n';
import { AppEnvs } from '../../config/@types';
import { AppConfigClass } from '../../config/classes';
import { I18nDtoType } from '../@types';

@Injectable()
export class TranslationService {
  constructor(
    private readonly service: I18nService,
    private readonly configs: AppConfigClass,
  ) {}

  translate(
    k: string,
    args?:
      | (
          | {
              [k: string]: any;
            }
          | string
        )[]
      | {
          [k: string]: any;
        },
    options?: TranslateOptions,
  ): string {
    if (this.configs.appConfigs.env === AppEnvs.TEST) {
      return k;
    }
    return this.service.translate(k, {
      ...(args ? { args } : {}),
      debug: false,
      ...options,
    });
  }

  translateValidationErrors(toTranslate: string): string {
    if (!toTranslate) return toTranslate;

    try {
      const toTranslateObj: I18nDtoType = JSON.parse(toTranslate);

      const args = {};
      args['property'] = toTranslateObj.property;
      args['value'] = toTranslateObj.value;

      if (toTranslateObj.constraints) {
        toTranslateObj.constraints.forEach(
          (c, i) => (args[`constraint${i + 1}`] = c),
        );
      }

      return this.translate(toTranslateObj.key, args);
    } catch (error) {
      return this.translate(toTranslate);
    }
  }
}
