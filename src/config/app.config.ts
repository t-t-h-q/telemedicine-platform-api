import { registerAs } from '@nestjs/config';
import { AppConfig } from './app-config.type';
import validateConfig from '.././utils/validate-config';
import {
  IsEnum,
  IsInt,
  IsOptional,
  IsString,
  IsUrl,
  Max,
  Min,
} from 'class-validator';

enum Environment {
  Development = 'development',
  Production = 'production',
  Test = 'test',
}

class EnvironmentVariablesValidator {
  @IsEnum(Environment)
  @IsOptional()
  NODE_ENV: Environment;

  @IsInt()
  @Min(0)
  @Max(65535)
  @IsOptional()
  APP_PORT: number;

  @IsUrl({ require_tld: false })
  @IsOptional()
  FRONTEND_DOMAIN: string;

  @IsUrl({ require_tld: false })
  @IsOptional()
  BACKEND_DOMAIN: string;

  @IsString()
  @IsOptional()
  API_PREFIX: string;

  @IsString()
  @IsOptional()
  APP_FALLBACK_LANGUAGE: string;

  @IsString()
  @IsOptional()
  APP_HEADER_LANGUAGE: string;
}

/**
 * Registers the application configuration using the `registerAs` function.
 * Validates the environment variables using `validateConfig` and `EnvironmentVariablesValidator`.
 *
 * @returns {AppConfig} The application configuration object.
 *
 * @property {string} nodeEnv - The Node.js environment (default: 'development').
 * @property {string} name - The application name (default: 'Telemedicine Platform').
 * @property {string} workingDirectory - The working directory of the application.
 * @property {string} frontendDomain - The frontend domain of the application.
 * @property {string} backendDomain - The backend domain of the application (default: 'http://localhost').
 * @property {number} port - The port on which the application runs (default: 3000).
 * @property {string} apiPrefix - The API prefix (default: 'api').
 * @property {string} fallbackLanguage - The fallback language for the application (default: 'en').
 * @property {string} headerLanguage - The header language key (default: 'x-custom-lang').
 */
export default registerAs<AppConfig>('app', () => {
  validateConfig(process.env, EnvironmentVariablesValidator);

  return {
    nodeEnv: process.env.NODE_ENV || 'development',
    name: process.env.APP_NAME || 'Telemedicine Platform',
    workingDirectory: process.cwd(),
    frontendDomain: process.env.FRONTEND_DOMAIN,
    backendDomain: process.env.BACKEND_DOMAIN ?? 'http://localhost',
    port: process.env.APP_PORT
      ? parseInt(process.env.APP_PORT, 10)
      : process.env.PORT
        ? parseInt(process.env.PORT, 10)
        : 3000,
    apiPrefix: process.env.API_PREFIX || 'api',
    fallbackLanguage: process.env.APP_FALLBACK_LANGUAGE || 'en',
    headerLanguage: process.env.APP_HEADER_LANGUAGE || 'x-custom-lang',
  };
});
