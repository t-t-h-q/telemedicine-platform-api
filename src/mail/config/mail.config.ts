/**
 * This module defines the configuration for the mail service in the telemedicine platform API.
 * It uses the `@nestjs/config` package to register the mail configuration and validates the
 * environment variables using `class-validator`.
 *
 * The `EnvironmentVariablesValidator` class is used to validate the environment variables
 * required for the mail configuration. The `validateConfig` function is used to perform the
 * validation.
 *
 * The configuration includes the following properties:
 * - `port`: The port number for the mail server (default is 587).
 * - `host`: The host address of the mail server.
 * - `user`: The username for the mail server (optional).
 * - `password`: The password for the mail server (optional).
 * - `defaultEmail`: The default email address used for sending emails.
 * - `defaultName`: The default name used for sending emails.
 * - `ignoreTLS`: A boolean indicating whether to ignore TLS (Transport Layer Security).
 * - `secure`: A boolean indicating whether to use a secure connection.
 * - `requireTLS`: A boolean indicating whether to require TLS.
 *
 * @module mail/config/mail.config
 */
import { registerAs } from '@nestjs/config';

import {
  IsString,
  IsInt,
  Min,
  Max,
  IsOptional,
  IsBoolean,
  IsEmail,
} from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { MailConfig } from './mail-config.type';

class EnvironmentVariablesValidator {
  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  MAIL_PORT: number;

  @IsString()
  MAIL_HOST: string;

  @IsString()
  @IsOptional()
  MAIL_USER: string;

  @IsString()
  @IsOptional()
  MAIL_PASSWORD: string;

  @IsEmail()
  MAIL_DEFAULT_EMAIL: string;

  @IsString()
  MAIL_DEFAULT_NAME: string;

  @IsBoolean()
  MAIL_IGNORE_TLS: boolean;

  @IsBoolean()
  MAIL_SECURE: boolean;

  @IsBoolean()
  MAIL_REQUIRE_TLS: boolean;
}

export default registerAs<MailConfig>('mail', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    port: process.env.MAIL_PORT ? parseInt(process.env.MAIL_PORT, 10) : 587,
    host: process.env.MAIL_HOST,
    user: process.env.MAIL_USER,
    password: process.env.MAIL_PASSWORD,
    defaultEmail: process.env.MAIL_DEFAULT_EMAIL,
    defaultName: process.env.MAIL_DEFAULT_NAME,
    ignoreTLS: process.env.MAIL_IGNORE_TLS === 'true',
    secure: process.env.MAIL_SECURE === 'true',
    requireTLS: process.env.MAIL_REQUIRE_TLS === 'true',
  };
});
