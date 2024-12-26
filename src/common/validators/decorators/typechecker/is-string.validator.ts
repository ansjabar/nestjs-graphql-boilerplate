import {
  registerDecorator,
  ValidationOptions,
  isString,
} from 'class-validator';
import { i18nV } from '../../../helpers';

export function IsString(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    const defaultValidationOptions: ValidationOptions = {
      ...validationOptions,
      message:
        validationOptions?.message || validationOptions?.each
          ? i18nV('validations.isString.multiple')
          : i18nV('validations.isString.single'),
    };

    registerDecorator({
      name: 'IsString',
      target: object.constructor,
      propertyName: propertyName,
      options: defaultValidationOptions,
      validator: {
        validate(value: any) {
          return isString(value);
        },
      },
    });
  };
}
