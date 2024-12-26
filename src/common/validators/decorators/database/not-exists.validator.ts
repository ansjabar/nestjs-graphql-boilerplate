import { registerDecorator, ValidationOptions } from 'class-validator';
import { i18nV } from '../../../helpers';
import { NotExistsValidator } from '../../classes';
import { ExistsConstraints } from './exists.validator';

export function NotExists<T>(
  constraints: ExistsConstraints<T>,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    const defaultValidationOptions: ValidationOptions = {
      ...validationOptions,
      message:
        validationOptions?.message || validationOptions?.each
          ? i18nV('validations.notExists.multiple')
          : i18nV('validations.notExists.single'),
    };

    registerDecorator({
      name: 'NotExists',
      target: object.constructor,
      propertyName,
      constraints: [
        constraints.entityName,
        constraints.column,
        constraints.additionalWhere,
      ],
      options: defaultValidationOptions,
      validator: NotExistsValidator,
    });
  };
}
