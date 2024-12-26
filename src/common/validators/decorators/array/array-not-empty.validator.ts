import {
  registerDecorator,
  ValidationOptions,
  arrayNotEmpty,
} from 'class-validator';
import { i18nV } from '../../../helpers';

export function ArrayNotEmpty(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    const defaultValidationOptions: ValidationOptions = {
      ...validationOptions,
      message:
        validationOptions?.message || validationOptions?.each
          ? i18nV('validations.arrayNotEmpty.multiple')
          : i18nV('validations.arrayNotEmpty.single'),
    };

    registerDecorator({
      name: 'ArrayNotEmpty',
      target: object.constructor,
      propertyName: propertyName,
      options: defaultValidationOptions,
      validator: {
        validate(value: any) {
          return arrayNotEmpty(value);
        },
      },
    });
  };
}
