import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
  ValidationArguments,
} from 'class-validator';
import { isArray, uniq } from 'lodash';

@ValidatorConstraint({ name: 'exists', async: true })
export class UniqueValiadtor implements ValidatorConstraintInterface {
  async validate(value: any[]) {
    if (!isArray(value)) return false;

    return uniq(value).length === value.length;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} must have unique elements`;
  }
}
