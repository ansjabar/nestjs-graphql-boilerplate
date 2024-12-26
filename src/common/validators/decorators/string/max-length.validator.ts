import {
  registerDecorator,
  ValidationOptions,
  maxLength,
} from 'class-validator';
import { i18nV } from '../../../helpers';

export function MaxLength(max?: number, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    const defaultValidationOptions: ValidationOptions = {
      ...validationOptions,
      message:
        validationOptions?.message || validationOptions?.each
          ? i18nV('validations.maxLength.multiple', 1)
          : i18nV('validations.maxLength.single', 1),
    };

    registerDecorator({
      name: 'MaxLength',
      target: object.constructor,
      propertyName: propertyName,
      options: defaultValidationOptions,
      validator: {
        validate(value: any) {
          return maxLength(value, max);
        },
      },
    });
  };
}
