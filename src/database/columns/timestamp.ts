import { TableColumnOptions } from 'typeorm';
import { ColumnOptions } from './@types';

const type = 'timestamp';

export const timestampNullable = (
  name: string,
  options?: ColumnOptions,
): TableColumnOptions => {
  return {
    name,
    type,
    isNullable: true,
    ...options,
  };
};

export const createdAt = (options?: ColumnOptions) => {
  return {
    name: 'createdAt',
    type,
    default: 'CURRENT_TIMESTAMP',
    isNullable: false,
    ...options,
  };
};

export const updatedAt = (options?: ColumnOptions) => {
  return {
    name: 'updatedAt',
    type: 'timestamp',
    default: 'CURRENT_TIMESTAMP',
    isNullable: false,
    ...options,
  };
};

export const deletedAt = (options?: ColumnOptions) => {
  return {
    name: 'deletedAt',
    type: 'timestamp',
    isNullable: true,
    ...options,
  };
};
