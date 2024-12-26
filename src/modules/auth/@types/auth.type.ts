import { registerEnumType } from '@nestjs/graphql';

export enum LogoutDeviceTypes {
  ALL = 'ALL',
  THIS = 'THIS',
}

registerEnumType(LogoutDeviceTypes, { name: 'LogoutDeviceTypes' });
