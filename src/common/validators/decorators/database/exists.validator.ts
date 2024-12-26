import { registerDecorator, ValidationOptions } from 'class-validator';
import { FindOptionsWhere } from 'typeorm';
import { EntityNamesType } from '../../../@types/entity.type';
import { i18nV } from '../../../helpers';
import { ExistsValidator } from '../../classes';

export type ExistsConstraints<T> = {
  entityName: EntityNamesType;
  column: keyof T;
  additionalWhere?: FindOptionsWhere<T>;
};

export function Exists<T>(
  constraints: ExistsConstraints<T>,
  validationOptions?: ValidationOptions,
) {
  return function (object: object, propertyName: string) {
    const defaultValidationOptions: ValidationOptions = {
      ...validationOptions,
      message:
        validationOptions?.message || validationOptions?.each
          ? i18nV('validations.exists.multiple')
          : i18nV('validations.exists.single'),
    };

    registerDecorator({
      name: 'Exists',
      target: object.constructor,
      propertyName,
      constraints: [
        constraints.entityName,
        constraints.column,
        constraints.additionalWhere,
      ],
      options: defaultValidationOptions,
      validator: ExistsValidator,
    });
  };
}
