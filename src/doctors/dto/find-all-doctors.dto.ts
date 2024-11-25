import { ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional } from 'class-validator';
import { Transform } from 'class-transformer';

export class FindAllDoctorsDto {
  @ApiPropertyOptional({
    description: 'The page number',
    example: 1,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  page: number;

  @ApiPropertyOptional({
    description: 'The number of items per page',
    example: 10,
  })
  @IsOptional()
  @IsNumber()
  @Transform(({ value }) => parseInt(value))
  limit: number;

  @ApiPropertyOptional({
    description: 'Search term to filter doctors by name or specialty',
    example: 'Tuan',
  })
  @IsOptional()
  search: string;

  @ApiPropertyOptional({
    description: 'Filter doctors by specialty',
    example: 'Cardiology',
  })
  @IsOptional()
  specialties: string;

  @ApiPropertyOptional({
    description: 'Filter doctors by city',
    example: 'Sai Gon',
  })
  @IsOptional()
  city: string;
}
