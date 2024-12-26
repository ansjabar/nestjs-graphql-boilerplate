import { Injectable } from '@nestjs/common';
import { ValidatorConstraint, ValidationArguments } from 'class-validator';
import { ExistsValidator } from './exists.validator';

@ValidatorConstraint({ name: 'exists', async: true })
@Injectable()
export class NotExistsValidator extends ExistsValidator {
  protected getResult(result: any[], value: any[]) {
    return result ? result.length !== value.length : true;
  }

  defaultMessage(args: ValidationArguments) {
    return `${args.property} already exist`;
  }
}
