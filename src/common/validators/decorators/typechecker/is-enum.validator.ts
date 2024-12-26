import { registerDecorator, ValidationOptions, isEnum } from 'class-validator';
import { i18nV } from '../../../helpers';

export function IsEnum(entity: object, validationOptions?: ValidationOptions) {
  return function (object: object, propertyName: string) {
    const defaultValidationOptions: ValidationOptions = {
      ...validationOptions,
      message:
        validationOptions?.message || validationOptions?.each
          ? i18nV('validations.isEnum.multiple')
          : i18nV('validations.isEnum.single'),
    };

    registerDecorator({
      name: 'IsEnum',
      target: object.constructor,
      propertyName: propertyName,
      options: defaultValidationOptions,
      validator: {
        validate(value: any) {
          return isEnum(value, entity);
        },
      },
    });
  };
}
