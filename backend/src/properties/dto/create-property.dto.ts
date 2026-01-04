import { IsString, IsEnum, IsOptional, IsInt } from 'class-validator';
import { PropertyType } from '../../database/entities/property.entity';

export class CreatePropertyDto {
  @IsString()
  name: string;

  @IsEnum(PropertyType)
  type: PropertyType;

  @IsString()
  unique_number: string;

  @IsOptional()
  @IsInt()
  property_manager_id?: number;

  @IsOptional()
  @IsInt()
  accountant_id?: number;
}
