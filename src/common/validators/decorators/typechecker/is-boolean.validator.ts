import {
  registerDecorator,
  ValidationOptions,
  isBoolean,
} from 'class-validator';
import { i18nV } from '../../../helpers';

export function IsBoolean(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    const defaultValidationOptions: ValidationOptions = {
      ...validationOptions,
      message:
        validationOptions?.message || validationOptions?.each
          ? i18nV('validations.isBoolean.multiple')
          : i18nV('validations.isBoolean.single'),
    };

    registerDecorator({
      name: 'IsBoolean',
      target: object.constructor,
      propertyName: propertyName,
      options: defaultValidationOptions,
      validator: {
        validate(value: any) {
          return isBoolean(value);
        },
      },
    });
  };
}
