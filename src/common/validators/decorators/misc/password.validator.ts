import { registerDecorator, ValidationOptions } from 'class-validator';
import { i18nV } from '../../../helpers';
import { PasswordValidator } from '../../classes';

export function Password(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    const defaultValidationOptions: ValidationOptions = {
      ...validationOptions,
      message: validationOptions?.message || i18nV('validations.password'),
    };

    registerDecorator({
      name: 'Password',
      target: object.constructor,
      propertyName: propertyName,
      options: defaultValidationOptions,
      validator: PasswordValidator,
    });
  };
}
