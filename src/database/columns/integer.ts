import { TableColumnOptions } from 'typeorm';
import { ColumnOptions } from './@types';

const type = 'integer';

export const integerPrimary = (
  name = 'id',
  options?: ColumnOptions,
): TableColumnOptions => ({
  name,
  type,
  unsigned: true,
  isPrimary: true,
  isGenerated: true,
  ...options,
});

export const integerUnsignedNullable = (
  name: string,
  options?: ColumnOptions,
): TableColumnOptions => ({
  name,
  type,
  unsigned: true,
  isNullable: true,
  ...options,
});

export const integerUnsigned = (
  name: string,
  options?: ColumnOptions,
): TableColumnOptions => ({
  name,
  type,
  unsigned: true,
  isNullable: false,
  ...options,
});

export const integer = (
  name: string,
  options?: ColumnOptions,
): TableColumnOptions => ({
  name,
  type,
  unsigned: false,
  isNullable: false,
  ...options,
});

export const integerUnique = (
  name: string,
  options?: ColumnOptions,
): TableColumnOptions => ({
  name,
  type,
  unsigned: false,
  isUnique: true,
  isNullable: false,
  ...options,
});
