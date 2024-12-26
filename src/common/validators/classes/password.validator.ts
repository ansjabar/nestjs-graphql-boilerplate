import {
  ValidatorConstraint,
  ValidatorConstraintInterface,
} from 'class-validator';
import { i18nV } from '../../helpers';

@ValidatorConstraint({ name: 'customText', async: true })
export class PasswordValidator implements ValidatorConstraintInterface {
  async validate(text: string) {
    const validations = [
      /^(?=.*[A-Z]).+$/,
      /^(?=.*[a-z]).+$/,
      /^(?=.*[0-9]).+$/,
      /^[^\s]{8,}$/,
      /^(?=.*[~`!@#$%^&()--+={}[]|\:;"'<>,.?\/_₹]).*$/,
    ];

    let success = true;
    validations.forEach((v) => {
      if (!v.test(text)) {
        success = false;
      }
    });

    return success;
  }

  defaultMessage() {
    return i18nV('validations.password');
  }
}
