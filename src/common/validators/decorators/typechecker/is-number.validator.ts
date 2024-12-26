import {
  registerDecorator,
  ValidationOptions,
  isNumber,
  IsNumberOptions,
} from 'class-validator';
import { i18nV } from '../../../helpers';

type AdditionalOptions = {
  positive?: boolean;
};

export function IsNumber(
  options?: IsNumberOptions & AdditionalOptions,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    options = options || {};

    options.maxDecimalPlaces = options?.maxDecimalPlaces || 0;
    options.positive = options?.positive || true;

    let message: string;

    if (validationOptions?.each) {
      if (options?.positive === true)
        message = i18nV('validations.isNumber.multiplePositive');
      else if (options?.positive === false)
        message = i18nV('validations.isNumber.multiplePositive');
      else i18nV('validations.isNumber.multiple');
    } else {
      if (options?.positive === true)
        message = i18nV('validations.isNumber.singlePositive');
      else if (options?.positive === false)
        message = i18nV('validations.isNumber.singlePositive');
      else message = i18nV('validations.isNumber.single');
    }

    const defaultValidationOptions: ValidationOptions = {
      ...validationOptions,
      message: validationOptions?.message || message,
    };

    registerDecorator({
      name: 'IsNumber',
      target: object.constructor,
      propertyName: propertyName,
      options: defaultValidationOptions,
      validator: {
        validate(value: any) {
          if (!isNumber(value, options)) return false;

          if (options.positive && value < 0) return false;

          return true;
        },
      },
    });
  };
}
