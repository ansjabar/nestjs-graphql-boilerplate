import { registerDecorator, ValidationOptions, isArray } from 'class-validator';
import { i18nV } from '../../../helpers';

export function IsArray(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    const defaultValidationOptions: ValidationOptions = {
      ...validationOptions,
      message:
        validationOptions?.message || validationOptions?.each
          ? i18nV('validations.isArray.multiple')
          : i18nV('validations.isArray.single'),
    };

    registerDecorator({
      name: 'IsArray',
      target: object.constructor,
      propertyName: propertyName,
      options: defaultValidationOptions,
      validator: {
        validate(value: any) {
          return isArray(value);
        },
      },
    });
  };
}
