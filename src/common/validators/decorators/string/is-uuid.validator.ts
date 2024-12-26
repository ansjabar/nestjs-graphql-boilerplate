import { registerDecorator, ValidationOptions, isUUID } from 'class-validator';
import { UUIDVersion } from 'validator';
import { i18nV } from '../../../helpers';

export function IsUUID(
  version?: UUIDVersion,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    const defaultValidationOptions: ValidationOptions = {
      ...validationOptions,
      message:
        validationOptions?.message || validationOptions?.each
          ? i18nV('validations.isUUID.multiple')
          : i18nV('validations.isUUID.single'),
    };

    registerDecorator({
      name: 'IsUUID',
      target: object.constructor,
      propertyName: propertyName,
      options: defaultValidationOptions,
      validator: {
        validate(value: any) {
          return isUUID(value, version);
        },
      },
    });
  };
}
