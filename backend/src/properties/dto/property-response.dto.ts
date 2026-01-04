import { PropertyType } from '../../database/entities/property.entity';

export class PropertyResponseDto {
  id: number;
  name: string;
  type: PropertyType;
  unique_number: string;
  property_manager_id?: number;
  accountant_id?: number;
  created_at: Date;
  updated_at: Date;
}
