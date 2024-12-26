import { TableColumnOptions } from 'typeorm';
import { ColumnOptions } from './@types';

const type = 'uuid';

export const uuidPrimary = (
  name = 'id',
  options?: ColumnOptions,
): TableColumnOptions => ({
  name,
  type,
  isPrimary: true,
  default: 'uuid_generate_v4()',
  ...options,
});

export const uuid = (
  name = 'id',
  options?: ColumnOptions,
): TableColumnOptions => ({
  name,
  type,
  isNullable: false,
  ...options,
});

export const uuidNullable = (
  name = 'id',
  options?: ColumnOptions,
): TableColumnOptions => ({
  name,
  type,
  isNullable: true,
  ...options,
});
