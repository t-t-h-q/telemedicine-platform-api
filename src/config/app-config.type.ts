/**
 * Represents the configuration settings for the application.
 * 
 * @property {string} nodeEnv - The environment in which the application is running (e.g., development, production).
 * @property {string} name - The name of the application.
 * @property {string} workingDirectory - The working directory of the application.
 * @property {string} [frontendDomain] - The domain for the frontend application (optional).
 * @property {string} backendDomain - The domain for the backend application.
 * @property {number} port - The port number on which the application is running.
 * @property {string} apiPrefix - The prefix for the API routes.
 * @property {string} fallbackLanguage - The default language to fall back to if no other language is specified.
 * @property {string} headerLanguage - The language specified in the request headers.
 */
export type AppConfig = {
  nodeEnv: string;
  name: string;
  workingDirectory: string;
  frontendDomain?: string;
  backendDomain: string;
  port: number;
  apiPrefix: string;
  fallbackLanguage: string;
  headerLanguage: string;
};
