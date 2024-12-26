import { I18nDtoType } from '../@types';

export const i18nV = (key: string, noOfConstraints?: number): string => {
  const message: I18nDtoType = {
    key,
    property: '$property',
    value: '$value',
  };

  if (noOfConstraints) {
    const constraints: string[] = [];
    for (let i = 1; i <= noOfConstraints; i++) {
      constraints.push(`$constraint${i}`);
    }
    message['constraints'] = constraints;
  }

  return JSON.stringify(message);
};
