import { DriverType } from '@codebrew/nestjs-storage';
import { plainToInstance } from 'class-transformer';
import {
  IsEnum,
  IsIn,
  IsNotEmpty,
  IsNumber,
  IsOptional,
  IsString,
  MinLength,
  ValidateIf,
  validateSync,
} from 'class-validator';
import { AppEnvs } from '../@types';

class EnvironmentVariables {
  // APP
  @IsOptional()
  @IsString()
  APP_NAME: string;

  @IsNotEmpty()
  @IsEnum(AppEnvs)
  APP_ENV: AppEnvs;

  @IsNotEmpty()
  @IsString()
  APP_URL: string;

  @IsNotEmpty()
  @IsNumber()
  APP_PORT: number;

  @IsOptional()
  @IsIn(['true', 'false'])
  APP_GQL_PLAYGROUND: string;

  @IsNotEmpty({
    message: "Please run 'yarn key:generate' to generate applicatoin key",
  })
  @IsString()
  @MinLength(32)
  APP_KEY: string;

  // DATABASE
  @IsNotEmpty()
  @IsString()
  DB_CONNECTION: string;

  @ValidateIf(
    (o) => !['sqlite', 'sqlite3', 'better-sqlite3'].includes(o.DB_DATABASE),
  )
  @IsOptional()
  @IsString()
  DB_HOST: string;

  @ValidateIf(
    (o) => !['sqlite', 'sqlite3', 'better-sqlite3'].includes(o.MAIL_MAILER),
  )
  @IsOptional()
  @IsNumber()
  DB_PORT: number;

  @IsNotEmpty()
  @IsString()
  DB_DATABASE: string;

  @ValidateIf(
    (o) => !['sqlite', 'sqlite3', 'better-sqlite3'].includes(o.MAIL_MAILER),
  )
  @IsOptional()
  @IsString()
  DB_USERNAME: string;

  @ValidateIf(
    (o) => !['sqlite', 'sqlite3', 'better-sqlite3'].includes(o.MAIL_MAILER),
  )
  @IsOptional()
  @IsString()
  DB_PASSWORD: string;

  // MAIL
  @IsNotEmpty()
  @IsString()
  MAIL_MAILER: string;

  @IsNotEmpty()
  @IsString()
  MAIL_FROM: string;

  @ValidateIf((o) => o.MAIL_MAILER !== 'sendmail')
  @IsNotEmpty()
  @IsString()
  MAIL_HOST: string;

  @ValidateIf((o) => o.MAIL_MAILER !== 'sendmail')
  @IsNotEmpty()
  @IsNumber()
  MAIL_PORT: number;

  @ValidateIf((o) => o.MAIL_MAILER !== 'sendmail')
  @IsNotEmpty()
  @IsString()
  MAIL_USERNAME: string;

  @ValidateIf((o) => o.MAIL_MAILER !== 'sendmail')
  @IsNotEmpty()
  @IsString()
  MAIL_PASSWORD: string;

  @ValidateIf((o) => o.MAIL_MAILER !== 'sendmail')
  @IsNotEmpty()
  @IsString()
  MAIL_ENCRYPTION: string;

  // STORAGE
  @IsOptional()
  @IsNotEmpty()
  @IsEnum(DriverType)
  STORAGE_DISK: DriverType;

  @ValidateIf((o) => o.STORAGE_DISK === DriverType.LOCAL)
  @IsOptional()
  @IsNotEmpty()
  @IsString()
  STORAGE_LOCAL_PATH: string;

  // BUGSNAG
  @IsOptional()
  @IsNotEmpty()
  BUGSNAG_API_KEY: string;

  @IsOptional()
  @IsNotEmpty()
  BUGSNAG_RELEASE_STAGE: string;
}

export function validate(config: Record<string, unknown>) {
  const validatedConfig = plainToInstance(EnvironmentVariables, config, {
    enableImplicitConversion: true,
  });
  const errors = validateSync(validatedConfig, {
    skipMissingProperties: false,
  });

  if (errors.length > 0) {
    throw new Error(errors.toString());
  }
  return validatedConfig;
}
