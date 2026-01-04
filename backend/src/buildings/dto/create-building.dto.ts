import { IsString, IsOptional, IsInt } from 'class-validator';

export class CreateBuildingDto {
  @IsInt()
  property_id: number;

  @IsString()
  name: string;

  @IsString()
  street: string;

  @IsString()
  house_number: string;

  @IsString()
  postal_code: string;

  @IsString()
  city: string;

  @IsString()
  @IsOptional()
  country?: string;

  @IsString()
  @IsOptional()
  additional_details?: string;
}
