import { registerDecorator, ValidationOptions, length } from 'class-validator';
import { i18nV } from '../../../helpers';

export function Length(
  min: number,
  max?: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    let message: string;
    if (validationOptions?.each) {
      if (min & min) message = i18nV('validations.length.multipleMinMax', 2);
      else message = i18nV('validations.length.multipleMin', 1);
    } else {
      if (min & min) message = i18nV('validations.length.singleMinMax', 2);
      else message = i18nV('validations.length.singleMin', 1);
    }

    const defaultValidationOptions: ValidationOptions = {
      ...validationOptions,
      message: validationOptions?.message || message,
    };

    registerDecorator({
      name: 'Length',
      target: object.constructor,
      propertyName: propertyName,
      options: defaultValidationOptions,
      validator: {
        validate(value: any) {
          return length(value, min, max);
        },
      },
    });
  };
}
