import { TableColumnOptions } from 'typeorm';
import { ColumnOptions } from './@types';

const type = 'boolean';

export const booleanTrue = (
  name: string,
  options?: ColumnOptions,
): TableColumnOptions => {
  return { name, type, default: true, isNullable: false, ...options };
};

export const booleanFalse = (
  name: string,
  options?: ColumnOptions,
): TableColumnOptions => {
  return { name, type, default: false, isNullable: false, ...options };
};
