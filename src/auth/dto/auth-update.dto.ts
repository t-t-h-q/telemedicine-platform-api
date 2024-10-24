import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, IsOptional, MinLength } from 'class-validator';
import { Transform } from 'class-transformer';
import { lowerCaseTransformer } from '../../utils/transformers/lower-case.transformer';

export class AuthUpdateDto {
  @ApiPropertyOptional({ example: 'Tuan' })
  @IsOptional()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  firstName?: string;

  @ApiPropertyOptional({ example: 'Nguyen' })
  @IsOptional()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  lastName?: string;

  @ApiPropertyOptional({ example: 'tuan@example.com' })
  @IsOptional()
  @IsNotEmpty()
  @IsEmail()
  @Transform(lowerCaseTransformer)
  email?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty()
  @MinLength(6)
  password?: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsNotEmpty({ message: 'mustBeNotEmpty' })
  oldPassword?: string;
}
