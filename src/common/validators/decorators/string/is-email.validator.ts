import { registerDecorator, ValidationOptions, isEmail } from 'class-validator';
import { IsEmailOptions } from 'validator';
import { i18nV } from '../../../helpers';

export function IsEmail(
  options?: IsEmailOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    const defaultValidationOptions: ValidationOptions = {
      ...validationOptions,
      message:
        validationOptions?.message || validationOptions?.each
          ? i18nV('validations.isEmail.multiple')
          : i18nV('validations.isEmail.single'),
    };

    registerDecorator({
      name: 'IsEmail',
      target: object.constructor,
      propertyName: propertyName,
      options: defaultValidationOptions,
      validator: {
        validate(value: any) {
          return isEmail(value, options);
        },
      },
    });
  };
}
