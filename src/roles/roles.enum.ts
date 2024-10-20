/**
 * Enum representing different roles within the telemedicine platform.
 * Each role is associated with a unique numeric identifier.
 *
 * @enum {number}
 * @property {number} admin - Represents an administrator with full access.
 * @property {number} user - Represents a regular user with standard access.
 * @property {number} moderator - Represents a moderator with permissions to manage content.
 * @property {number} patient - Represents a patient with access to medical services.
 * @property {number} doctor - Represents a doctor with access to patient management and medical services.
 */
export enum RoleEnum {
  'admin' = 1,
  'user' = 2,
  'moderator' = 3,
  'patient' = 4,
  'doctor' = 5,
}
