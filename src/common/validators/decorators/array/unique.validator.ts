import { registerDecorator, ValidationOptions } from 'class-validator';
import { i18nV } from '../../../helpers';
import { UniqueValiadtor } from '../../classes';

export function Unique(validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    const defaultValidationOptions: ValidationOptions = {
      ...validationOptions,
      message:
        validationOptions?.message || validationOptions?.each
          ? i18nV('validations.unique.multiple')
          : i18nV('validations.unique.single'),
    };

    registerDecorator({
      name: 'Unique',
      target: object.constructor,
      propertyName: propertyName,
      options: defaultValidationOptions,
      validator: UniqueValiadtor,
    });
  };
}
