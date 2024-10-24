import { User } from '../../../../domain/user';
import { UserSchemaClass } from '../entities/user.schema';
import { Role } from '../../../../../roles/domain/role';
import { Status } from '../../../../../statuses/domain/status';
import { RoleSchema } from '../../../../../roles/infrastructure/persistence/document/entities/role.schema';
import { StatusSchema } from '../../../../../statuses/infrastructure/persistence/document/entities/status.schema';

export class UserMapper {
  static toDomain(raw: UserSchemaClass): User {
    const domainEntity = new User();
    domainEntity.id = raw._id.toString();
    domainEntity.email = raw.email;
    domainEntity.password = raw.password;
    domainEntity.provider = raw.provider;
    domainEntity.socialId = raw.socialId;
    domainEntity.firstName = raw.firstName;
    domainEntity.lastName = raw.lastName;

    if (raw.role) {
      domainEntity.role = new Role();
      domainEntity.role.name = raw.role.name;
    }

    if (raw.status) {
      domainEntity.status = new Status();
      domainEntity.status.id = raw.status._id;
    }

    domainEntity.createdAt = raw.createdAt;
    domainEntity.updatedAt = raw.updatedAt;
    domainEntity.deletedAt = raw.deletedAt;

    return domainEntity;
  }

  static toPersistence(domainEntity: User): UserSchemaClass {
    let role: RoleSchema | undefined = undefined;

    if (domainEntity.role) {
      role = new RoleSchema();
      role.name = domainEntity.role.name;
    }

    let status: StatusSchema | undefined = undefined;

    if (domainEntity.status) {
      status = new StatusSchema();
      status._id = domainEntity.status.id.toString();
    }

    const persistenceSchema = new UserSchemaClass();
    if (domainEntity.id && typeof domainEntity.id === 'string') {
      persistenceSchema._id = domainEntity.id;
    }
    persistenceSchema.email = domainEntity.email;
    persistenceSchema.password = domainEntity.password;
    persistenceSchema.provider = domainEntity.provider;
    persistenceSchema.socialId = domainEntity.socialId;
    persistenceSchema.firstName = domainEntity.firstName;
    persistenceSchema.lastName = domainEntity.lastName;
    persistenceSchema.role = role;
    persistenceSchema.status = status;
    persistenceSchema.createdAt = domainEntity.createdAt;
    persistenceSchema.updatedAt = domainEntity.updatedAt;
    persistenceSchema.deletedAt = domainEntity.deletedAt;
    return persistenceSchema;
  }
}
