import { registerAs } from '@nestjs/config';

import { IsString } from 'class-validator';
import validateConfig from '../../utils/validate-config';
import { AuthConfig } from './auth-config.type';

/**
 * Class representing the environment variables required for authentication.
 * Each variable is validated to ensure it is a string.
 *
 * @class EnvironmentVariablesValidator
 *
 * @property {string} AUTH_JWT_SECRET - The secret key used for signing JWT tokens.
 * @property {string} AUTH_JWT_TOKEN_EXPIRES_IN - The expiration time for JWT tokens.
 * @property {string} AUTH_REFRESH_SECRET - The secret key used for signing refresh tokens.
 * @property {string} AUTH_REFRESH_TOKEN_EXPIRES_IN - The expiration time for refresh tokens.
 * @property {string} AUTH_FORGOT_SECRET - The secret key used for signing forgot password tokens.
 * @property {string} AUTH_FORGOT_TOKEN_EXPIRES_IN - The expiration time for forgot password tokens.
 * @property {string} AUTH_CONFIRM_EMAIL_SECRET - The secret key used for signing email confirmation tokens.
 * @property {string} AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN - The expiration time for email confirmation tokens.
 */
class EnvironmentVariablesValidator {
  @IsString()
  AUTH_JWT_SECRET: string;

  @IsString()
  AUTH_JWT_TOKEN_EXPIRES_IN: string;

  @IsString()
  AUTH_REFRESH_SECRET: string;

  @IsString()
  AUTH_REFRESH_TOKEN_EXPIRES_IN: string;

  @IsString()
  AUTH_FORGOT_SECRET: string;

  @IsString()
  AUTH_FORGOT_TOKEN_EXPIRES_IN: string;

  @IsString()
  AUTH_CONFIRM_EMAIL_SECRET: string;

  @IsString()
  AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN: string;
}

export default registerAs<AuthConfig>('auth', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    secret: process.env.AUTH_JWT_SECRET,
    expires: process.env.AUTH_JWT_TOKEN_EXPIRES_IN,
    refreshSecret: process.env.AUTH_REFRESH_SECRET,
    refreshExpires: process.env.AUTH_REFRESH_TOKEN_EXPIRES_IN,
    forgotSecret: process.env.AUTH_FORGOT_SECRET,
    forgotExpires: process.env.AUTH_FORGOT_TOKEN_EXPIRES_IN,
    confirmEmailSecret: process.env.AUTH_CONFIRM_EMAIL_SECRET,
    confirmEmailExpires: process.env.AUTH_CONFIRM_EMAIL_TOKEN_EXPIRES_IN,
  };
});
