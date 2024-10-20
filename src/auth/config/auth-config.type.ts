/**
 * Configuration options for authentication mechanisms.
 *
 * @property {string} [secret] - The secret key used for signing tokens.
 * @property {string} [expires] - The expiration time for the tokens.
 * @property {string} [refreshSecret] - The secret key used for signing refresh tokens.
 * @property {string} [refreshExpires] - The expiration time for the refresh tokens.
 * @property {string} [forgotSecret] - The secret key used for signing forgot password tokens.
 * @property {string} [forgotExpires] - The expiration time for the forgot password tokens.
 * @property {string} [confirmEmailSecret] - The secret key used for signing email confirmation tokens.
 * @property {string} [confirmEmailExpires] - The expiration time for the email confirmation tokens.
 */
export type AuthConfig = {
  secret?: string;
  expires?: string;
  refreshSecret?: string;
  refreshExpires?: string;
  forgotSecret?: string;
  forgotExpires?: string;
  confirmEmailSecret?: string;
  confirmEmailExpires?: string;
};
