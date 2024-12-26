import { Field, InputType } from '@nestjs/graphql';
import { IsString } from 'class-validator';
import { LogoutDeviceTypes } from '../@types';

@InputType()
export class LogoutRequestDto {
  @Field(() => LogoutDeviceTypes)
  @IsString()
  device: LogoutDeviceTypes;
}
