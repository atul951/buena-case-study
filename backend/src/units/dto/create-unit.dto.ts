import { IsString, IsEnum, IsOptional, IsNumber, IsInt } from 'class-validator';
import { UnitType } from '../../database/entities/unit.entity';

export class CreateUnitDto {
  @IsInt()
  building_id: number;

  @IsString()
  number: string;

  @IsEnum(UnitType)
  type: UnitType;

  @IsString()
  @IsOptional()
  floor?: string;

  @IsString()
  @IsOptional()
  entrance?: string;

  @IsNumber()
  @IsOptional()
  size?: number;

  @IsNumber()
  @IsOptional()
  co_ownership_share?: number;

  @IsInt()
  @IsOptional()
  construction_year?: number;

  @IsInt()
  @IsOptional()
  rooms?: number;
}
