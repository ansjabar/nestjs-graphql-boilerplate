import {
  registerDecorator,
  ValidationOptions,
  arrayMinSize,
  arrayMaxSize,
} from 'class-validator';
import { i18nV } from '../../../helpers';

export function ArraySize(
  min: number,
  max?: number,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    let message: string;
    if (validationOptions?.each) {
      if (min & min) message = i18nV('validations.arraySize.multipleMinMax', 2);
      else message = i18nV('validations.arraySize.multipleMin', 1);
    } else {
      if (min & min) message = i18nV('validations.arraySize.singleMinMax', 2);
      else message = i18nV('validations.arraySize.singleMin', 1);
    }

    const defaultValidationOptions: ValidationOptions = {
      ...validationOptions,
      message: validationOptions?.message || message,
    };

    registerDecorator({
      name: 'ArraySize',
      target: object.constructor,
      propertyName: propertyName,
      options: defaultValidationOptions,
      constraints: [min, max],
      validator: {
        validate(value: any) {
          if (!arrayMinSize(value, min)) return false;
          if (min & max && !arrayMaxSize(value, max)) return false;
          return true;
        },
      },
    });
  };
}
