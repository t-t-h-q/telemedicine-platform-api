import {
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
  UnprocessableEntityException,
} from '@nestjs/common';
import * as ms from 'ms';
import * as crypto from 'crypto';
import { randomStringGenerator } from '@nestjs/common/utils/random-string-generator.util';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcryptjs';
import { AuthEmailLoginDto } from './dto/auth-email-login.dto';
import { AuthUpdateDto } from './dto/auth-update.dto';
import { AuthProvidersEnum } from './auth-providers.enum';
import { AuthRegisterLoginDto } from './dto/auth-register-login.dto';
import { NullableType } from '../utils/types/nullable.type';
import { LoginResponseDto } from './dto/login-response.dto';
import { ConfigService } from '@nestjs/config';
import { JwtRefreshPayloadType } from './strategies/types/jwt-refresh-payload.type';
import { JwtPayloadType } from './strategies/types/jwt-payload.type';
import { UsersService } from '../users/users.service';
import { AllConfigType } from '../config/config.type';
import { MailService } from '../mail/mail.service';
import { RoleEnum } from '../roles/roles.enum';
import { Session } from '../session/domain/session';
import { SessionService } from '../session/session.service';
import { StatusEnum } from '../statuses/statuses.enum';
import { User } from '../users/domain/user';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private sessionService: SessionService,
    private mailService: MailService,
    private configService: ConfigService<AllConfigType>,
  ) {}

  async validateLogin(loginDto: AuthEmailLoginDto): Promise<LoginResponseDto> {
    const user = await this.usersService.findByEmail(loginDto.email);

    if (!user) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: 'notFound',
        },
      });
    }

    if (user.provider !== AuthProvidersEnum.email) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          email: `needLoginViaProvider:${user.provider}`,
        },
      });
    }

    await this.validatePassword(user.password, loginDto.password);

    return this.generateAndReturnLoginResponse(user);
  }

  async register(dto: AuthRegisterLoginDto): Promise<void> {
    const user = await this.usersService.create({
      ...dto,
      email: dto.email,
      role: {
        name: RoleEnum.user,
      },
      status: {
        id: StatusEnum.inactive,
      },
    });

    const hash = await this.generateConfirmEmailHash(user.id);

    await this.mailService.userSignUp({
      to: dto.email,
      data: {
        hash,
      },
    });
  }

  async confirmEmail(hash: string): Promise<void> {
    let userId: User['id'];

    try {
      userId = await this.verifyConfirmEmailHash(hash);
    } catch {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          hash: `invalidHash`,
        },
      });
    }

    const user = await this.usersService.findById(userId);

    if (user?.status?.id?.toString() !== StatusEnum.inactive.toString()) {
      throw new NotFoundException({
        status: HttpStatus.NOT_FOUND,
        error: `notFound`,
      });
    }

    user.status = {
      id: StatusEnum.active,
    };

    await this.usersService.update(user.id, user);
  }

  async me(userJwtPayload: JwtPayloadType): Promise<NullableType<User>> {
    return this.usersService.findById(userJwtPayload.id);
  }

  async update(
    userJwtPayload: JwtPayloadType,
    userDto: AuthUpdateDto,
  ): Promise<NullableType<User>> {
    const currentUser = await this.usersService.findById(userJwtPayload.id);

    if (!currentUser) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          user: 'userNotFound',
        },
      });
    }

    if (userDto.password) {
      await this.validateOldPassword(currentUser.password, userDto.oldPassword);
      await this.sessionService.deleteByUserIdWithExclude({
        userId: currentUser.id,
        excludeSessionId: userJwtPayload.sessionId,
      });
    }

    delete userDto.oldPassword;

    await this.usersService.update(userJwtPayload.id, userDto);

    return this.usersService.findById(userJwtPayload.id);
  }

  async refreshToken(
    data: Pick<JwtRefreshPayloadType, 'sessionId' | 'hash'>,
  ): Promise<Omit<LoginResponseDto, 'user'>> {
    const session = await this.sessionService.findById(data.sessionId);

    if (!session || session.hash !== data.hash) {
      throw new UnauthorizedException('Session not found or hash mismatch');
    }

    return this.generateAndReturnLoginResponse(session.user, session);
  }

  async delete(user: User): Promise<void> {
    await this.usersService.remove(user.id);
  }

  async logout(data: Pick<JwtRefreshPayloadType, 'sessionId'>): Promise<void> {
    await this.sessionService.deleteById(data.sessionId);
  }

  private async generateAndReturnLoginResponse(
    user: User,
    session?: Session,
  ): Promise<LoginResponseDto> {
    const newSession = session ?? (await this.createNewSession(user));
    const { token, refreshToken, tokenExpires } = await this.getTokensData({
      id: user.id,
      role: user.role,
      sessionId: newSession.id,
      hash: newSession.hash,
    });

    return {
      refreshToken,
      token,
      tokenExpires,
      user,
    };
  }

  private async createNewSession(user: User): Promise<Session> {
    const hash = crypto
      .createHash('sha256')
      .update(randomStringGenerator())
      .digest('hex');

    return this.sessionService.create({
      user,
      hash,
    });
  }

  private async validatePassword(currentPassword: string, password?: string) {
    if (!password || !currentPassword) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'missingPassword',
        },
      });
    }

    const isValidPassword = await bcrypt.compare(password, currentPassword);

    if (!isValidPassword) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          password: 'incorrectPassword',
        },
      });
    }
  }

  private async validateOldPassword(
    currentPassword: string,
    oldPassword?: string,
  ) {
    if (!oldPassword) {
      throw new UnprocessableEntityException({
        status: HttpStatus.UNPROCESSABLE_ENTITY,
        errors: {
          oldPassword: 'missingOldPassword',
        },
      });
    }

    await this.validatePassword(currentPassword, oldPassword);
  }

  private async generateConfirmEmailHash(userId: User['id']): Promise<string> {
    return this.jwtService.signAsync(
      {
        confirmEmailUserId: userId,
      },
      {
        secret: this.configService.getOrThrow(
          'auth.confirmEmailSecret' as keyof AllConfigType,
          {
            infer: true,
          },
        ),
        expiresIn: this.configService.getOrThrow(
          'auth.confirmEmailExpires' as keyof AllConfigType,
          {
            infer: true,
          },
        ),
      },
    );
  }

  private async verifyConfirmEmailHash(hash: string): Promise<User['id']> {
    const jwtData = await this.jwtService.verifyAsync<{
      confirmEmailUserId: User['id'];
    }>(hash, {
      secret: this.configService.getOrThrow(
        'auth.confirmEmailSecret' as keyof AllConfigType,
        {
          infer: true,
        },
      ),
    });

    return jwtData.confirmEmailUserId;
  }

  private async getTokensData(data: {
    id: User['id'];
    role: User['role'];
    sessionId: Session['id'];
    hash: Session['hash'];
  }) {
    const tokenExpiresIn = this.configService.getOrThrow<string>(
      'auth.expires',
      {
        infer: true,
      },
    );

    const tokenExpires = Date.now() + ms(tokenExpiresIn);

    const [token, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        {
          id: data.id,
          role: data.role,
          sessionId: data.sessionId,
        },
        {
          secret: this.configService.getOrThrow<string>(
            'auth.secret' as keyof AllConfigType,
            { infer: true },
          ),
          expiresIn: tokenExpiresIn,
        },
      ),
      this.jwtService.signAsync(
        {
          sessionId: data.sessionId,
          hash: data.hash,
        },
        {
          secret: this.configService.getOrThrow(
            'auth.refreshSecret' as keyof AllConfigType,
            {
              infer: true,
            },
          ),
          expiresIn: this.configService.getOrThrow(
            'auth.refreshExpires' as keyof AllConfigType,
            {
              infer: true,
            },
          ),
        },
      ),
    ]);

    return {
      token,
      refreshToken,
      tokenExpires,
    };
  }
}
