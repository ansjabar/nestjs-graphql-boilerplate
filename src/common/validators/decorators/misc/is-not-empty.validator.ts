import {
  registerDecorator,
  ValidationOptions,
  isNotEmpty,
} from 'class-validator';
import { i18nV } from '../../../helpers';

export function IsNotEmpty(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    const defaultValidationOptions: ValidationOptions = {
      ...validationOptions,
      message:
        validationOptions?.message || validationOptions?.each
          ? i18nV('validations.isNotEmpty.multiple')
          : i18nV('validations.isNotEmpty.single'),
    };

    registerDecorator({
      name: 'IsNotEmpty',
      target: object.constructor,
      propertyName: propertyName,
      options: defaultValidationOptions,
      validator: {
        validate(value: any) {
          return isNotEmpty(value);
        },
      },
    });
  };
}
