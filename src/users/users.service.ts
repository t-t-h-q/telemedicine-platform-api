import {
  HttpStatus,
  Injectable,
  UnprocessableEntityException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { NullableType } from '../utils/types/nullable.type';
import { UserRepository } from './infrastructure/persistence/user.repository';
import { User } from './domain/user';
import * as bcrypt from 'bcryptjs';
import { AuthProvidersEnum } from '../auth/auth-providers.enum';
import { RoleEnum } from '../roles/roles.enum';
import { StatusEnum } from '../statuses/statuses.enum';
import { Role } from '../roles/domain/role';
import { Status } from '../statuses/domain/status';
import { UpdateUserDto } from './dto/update-user.dto';

@Injectable()
export class UsersService {
  constructor(private readonly usersRepository: UserRepository) {}

  /**
   * Creates a new user with the provided details.
   *
   * @param {CreateUserDto} createUserDto - The data transfer object containing user creation details.
   * @returns {Promise<User>} - A promise that resolves to the created user.
   *
   * @throws {UnprocessableEntityException} - If the email already exists, the role does not exist, or the status does not exist.
   */
  async create(createUserDto: CreateUserDto): Promise<User> {
    const { email, password, role, status } =
      await this.validateAndPrepareUserData(createUserDto);

    return this.usersRepository.create({
      firstName: createUserDto.firstName,
      lastName: createUserDto.lastName,
      email: email,
      password: password,
      role: role,
      status: status,
      provider: createUserDto.provider ?? AuthProvidersEnum.email,
      socialId: createUserDto.socialId,
    });
  }

  /**
   * Finds a user by their unique identifier.
   *
   * @param id - The unique identifier of the user.
   * @returns A promise that resolves to the user if found, or null if not found.
   */
  findById(id: User['id']): Promise<NullableType<User>> {
    return this.usersRepository.findById(id);
  }

  /**
   * Finds a user by their email address.
   *
   * @param email - The email address of the user to find.
   * @returns A promise that resolves to the user if found, or null if not found.
   */
  findByEmail(email: User['email']): Promise<NullableType<User>> {
    return this.usersRepository.findByEmail(email);
  }

  /**
   * Updates a user with the given `updateUserDto` data.
   *
   * @param id - The ID of the user to update.
   * @param updateUserDto - The data transfer object containing the updated user information.
   * @returns A promise that resolves to the updated user or null if the user could not be found.
   * @throws {UnprocessableEntityException} If the email already exists or if the role/status does not exist.
   */
  async update(
    id: User['id'],
    updateUserDto: UpdateUserDto,
  ): Promise<User | null> {
    const { email, password, role, status } =
      await this.validateAndPrepareUserData(updateUserDto, id);

    return this.usersRepository.update(id, {
      firstName: updateUserDto.firstName,
      lastName: updateUserDto.lastName,
      email,
      password,
      role,
      status,
      provider: updateUserDto.provider,
      socialId: updateUserDto.socialId,
    });
  }

  /**
   * Removes a user from the repository by their ID.
   *
   * @param id - The unique identifier of the user to be removed.
   * @returns A promise that resolves when the user has been removed.
   */
  async remove(id: User['id']): Promise<void> {
    await this.usersRepository.remove(id);
  }

  /**
   * Validates and prepares user data for creation or updating.
   * This method handles common logic for both create and update operations,
   * such as password hashing, email uniqueness checks, and role/status validation.
   *
   * @param userData - The user data to validate and prepare.
   * @param userId - Optional ID of the user being updated. Used for email uniqueness check.
   * @returns An object containing the validated and prepared user data.
   * @throws {UnprocessableEntityException} If validation fails.
   */
  private async validateAndPrepareUserData(
    userData: CreateUserDto | UpdateUserDto,
    userId?: User['id'],
  ): Promise<{
    email: string | null | undefined;
    password?: string;
    role?: Role;
    status?: Status;
  }> {
    const { email, password, role, status } = userData;

    // Hash the password if provided and different from the existing one
    let hashedPassword: string | undefined = undefined;
    if (password) {
      const hasNewPassword = userId
        ? (await this.usersRepository.findById(userId))?.password !== password
        : true;
      if (hasNewPassword) {
        const salt = await bcrypt.genSalt();
        hashedPassword = await bcrypt.hash(password, salt);
      }
    }

    // Check email uniqueness
    let validatedEmail: string | null | undefined = undefined;
    if (email) {
      const existingUser = await this.usersRepository.findByEmail(email);
      if (existingUser && existingUser.id !== userId) {
        throw new UnprocessableEntityException({
          status: HttpStatus.UNPROCESSABLE_ENTITY,
          errors: {
            email: 'emailAlreadyExists',
          },
        });
      }
      validatedEmail = email;
    } else if (email === null) {
      validatedEmail = null;
    }

    // Validate role
    let validatedRole: Role | undefined = undefined;
    if (role?.name) {
      validatedRole = this.validateRole(role.name);
    }

    // Validate status
    let validatedStatus: Status | undefined = undefined;
    if (status?.id) {
      validatedStatus = this.validateStatus(Number(status.id));
    }

    return {
      email: validatedEmail,
      password: hashedPassword,
      role: validatedRole,
      status: validatedStatus,
    };
  }

  /**
   * Validates a role ID against the RoleEnum.
   *
   * @param roleId - The role ID to validate.
   * @returns The role object if valid.
   * @throws {UnprocessableEntityException} If the role ID is invalid.
   */
  private validateRole(roleName: string): Role {
    if (!Object.values(RoleEnum).includes(roleName as RoleEnum)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          role: 'roleNotExists',
        },
      });
    }
    return { name: roleName };
  }

  /**
   * Validates a status ID against the StatusEnum.
   *
   * @param statusId - The status ID to validate.
   * @returns The status object if valid.
   * @throws {UnprocessableEntityException} If the status ID is invalid.
   */
  private validateStatus(statusId: number): Status {
    if (!Object.values(StatusEnum).includes(statusId)) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          status: 'statusNotExists',
        },
      });
    }
    return { id: statusId };
  }
}
