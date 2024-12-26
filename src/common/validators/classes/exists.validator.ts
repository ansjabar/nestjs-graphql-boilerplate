import {
  ValidationArguments,
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { isArray, uniq } from 'lodash';
import { In } from 'typeorm';
import { dataSource } from '../../../database/data-source';
import { getEntityClass } from '../../helpers';

@ValidatorConstraint({ name: 'exists', async: true })
export class ExistsValidator implements ValidatorConstraintInterface {
  async validate(value: any, args: ValidationArguments) {
    const [entityName, columnToCheck, additionalWhere] = args.constraints;

    const repository = await dataSource.getRepository(
      getEntityClass(entityName),
    );

    value = isArray(value) ? uniq(value) : [value];

    const where = {
      [columnToCheck]: In(value),
      ...(additionalWhere ? additionalWhere : {}),
    };

    const result = await repository.find({ where, select: [columnToCheck] });
    return this.getResult(result, value);
  }

  protected getResult(result: any[], value: any[]) {
    return result ? result.length === value.length : false;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} does not exist`;
  }
}
