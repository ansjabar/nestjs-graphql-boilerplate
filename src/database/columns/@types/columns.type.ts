import { TableColumnOptions } from 'typeorm';

export type ColumnOptions = Omit<TableColumnOptions, 'name' | 'type'>;
