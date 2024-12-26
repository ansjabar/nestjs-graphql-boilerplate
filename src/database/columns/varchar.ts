import { TableColumnOptions } from 'typeorm';
import { ColumnOptions } from './@types';

const type = 'varchar';

export const varchar = (
  name: string,
  options?: ColumnOptions,
): TableColumnOptions => {
  return { name, type, isNullable: false, isUnique: false, ...options };
};

export const varchartNullableUnique = (
  name: string,
  options?: ColumnOptions,
): TableColumnOptions => {
  return { name, type, isNullable: false, isUnique: true, ...options };
};

export const varcharNullable = (
  name: string,
  options?: ColumnOptions,
): TableColumnOptions => {
  return { name, type, isNullable: true, isUnique: false, ...options };
};

export const varcharUnique = (
  name: string,
  options?: ColumnOptions,
): TableColumnOptions => {
  return { name, type, isNullable: false, isUnique: true, ...options };
};
