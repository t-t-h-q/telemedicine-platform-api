/**
 * Each role is associated with a unique string identifier.
 *
 * @enum {string}
 * @property {string} admin - Represents an administrator with full access.
 * @property {string} user - Represents a regular user with standard access.
 * @property {string} moderator - Represents a moderator with permissions to manage content.
 * @property {string} patient - Represents a patient with access to medical services.
 * @property {string} doctor - Represents a doctor with access to patient management and medical services.
 */
export enum RoleEnum {
  'admin' = 'admin',
  'user' = 'user',
  'moderator' = 'moderator',
  'patient' = 'patient',
  'doctor' = 'doctor',
}
