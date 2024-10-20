import { ExtractJwt, Strategy } from 'passport-jwt';
import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { ConfigService } from '@nestjs/config';
import { OrNeverType } from '../../utils/types/or-never.type';
import { JwtPayloadType } from './types/jwt-payload.type';
import { AllConfigType } from '../../config/config.type';

@Injectable()
/**
 * JwtStrategy class that extends PassportStrategy to handle JWT authentication.
 *
 * @class
 * @extends {PassportStrategy(Strategy, 'jwt')}
 *
 * @param {ConfigService<AllConfigType>} configService - Service to access configuration values.
 *
 * @method validate
 * @param {JwtPayloadType} payload - The JWT payload containing user information.
 * @returns {OrNeverType<JwtPayloadType>} - Returns the payload if valid, otherwise throws an UnauthorizedException.
 *
 * @throws {UnauthorizedException} - If the payload does not contain a valid user ID.
 */
export class JwtStrategy extends PassportStrategy(Strategy, 'jwt') {
  constructor(configService: ConfigService<AllConfigType>) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      secretOrKey: configService.get<string>('auth.secret', { infer: true }),
    });
  }

  public validate(payload: JwtPayloadType): OrNeverType<JwtPayloadType> {
    if (!payload.id) {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
