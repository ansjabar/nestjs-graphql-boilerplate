import {
  registerDecorator,
  ValidationOptions,
  minLength,
} from 'class-validator';
import { i18nV } from '../../../helpers';

export function MinLength(min?: number, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    const defaultValidationOptions: ValidationOptions = {
      ...validationOptions,
      message:
        validationOptions?.message || validationOptions?.each
          ? i18nV('validations.minLength.multiple', 1)
          : i18nV('validations.minLength.single', 1),
    };

    registerDecorator({
      name: 'MinLength',
      target: object.constructor,
      propertyName: propertyName,
      options: defaultValidationOptions,
      validator: {
        validate(value: any) {
          return minLength(value, min);
        },
      },
    });
  };
}
