/**
 * Configuration settings for the mail service.
 *
 * @typedef {Object} MailConfig
 * @property {number} port - The port number to connect to the mail server.
 * @property {string} [host] - The hostname or IP address of the mail server.
 * @property {string} [user] - The username for authentication with the mail server.
 * @property {string} [password] - The password for authentication with the mail server.
 * @property {string} [defaultEmail] - The default email address to use for sending emails.
 * @property {string} [defaultName] - The default name to use for sending emails.
 * @property {boolean} ignoreTLS - Whether to ignore TLS when connecting to the mail server.
 * @property {boolean} secure - Whether to use a secure connection (SSL/TLS) to the mail server.
 * @property {boolean} requireTLS - Whether to require TLS when connecting to the mail server.
 */
export type MailConfig = {
  port: number;
  host?: string;
  user?: string;
  password?: string;
  defaultEmail?: string;
  defaultName?: string;
  ignoreTLS: boolean;
  secure: boolean;
  requireTLS: boolean;
};
