export enum PropertyType {
  WEG = 'WEG',
  MV = 'MV',
}

export enum UnitType {
  APARTMENT = 'Apartment',
  OFFICE = 'Office',
  GARDEN = 'Garden',
  PARKING = 'Parking',
}

export interface Property {
  id: number;
  name: string;
  type: PropertyType;
  unique_number: string;
  property_manager_id?: number;
  accountant_id?: number;
  created_at: string;
  updated_at: string;
  property_manager?: PropertyManager;
  accountant?: Accountant;
}

export interface PropertyManager {
  id: number;
  name: string;
  email: string;
}

export interface Accountant {
  id: number;
  name: string;
  email: string;
}

export interface Building {
  id: number;
  name: string;
  property_id: number;
  street: string;
  house_number: string;
  postal_code: string;
  city: string;
  country: string;
  additional_details?: string;
  created_at: string;
}

export interface Unit {
  id: number;
  building_id: number;
  number: string;
  type: UnitType;
  floor?: string;
  entrance?: string;
  size?: number;
  co_ownership_share?: number;
  construction_year?: number;
  rooms?: number;
  created_at: string;
}

export interface CreatePropertyDto {
  name: string;
  type: PropertyType;
  unique_number: string;
  property_manager_id?: number;
  accountant_id?: number;
}

// export interface CreateBuildingDto {
//   property_id: string;
//   street: string;
//   house_number: string;
//   postal_code: string;
//   city: string;
//   country?: string;
//   additional_details?: string;
// }

// export interface CreateUnitDto {
//   building_id: string;
//   number: string;
//   type: UnitType;
//   floor?: string;
//   entrance?: string;
//   size?: number;
//   co_ownership_share?: number;
//   construction_year?: number;
//   rooms?: number;
// }

// export interface PdfExtractionResult {
//   property_name: string;
//   buildings: Omit<CreateBuildingDto, 'property_id'>[];
//   units: Omit<CreateUnitDto, 'building_id'>[];
// }

export interface propertyExt {
  name: string;
  area: number;
  area_unit: string;
  internal_refrence_number: string;
  owner: string;
  ownership_share: number;
}

export interface BuildingExt {
  number: number;
  name: string;
  street: string;
  house_number: string;
  postal_code: string;
  city: string;
  country?: string;
  additional_details?: string;
}

export interface UnitExt {
  number: string;
  type: UnitType;
  building: string;
  floor?: string;
  entrance?: string;
  size?: number;
  co_ownership_share?: number;
  construction_year?: number;
  rooms?: number;
  description?: string;
}

export interface PdfExtractionResult {
  property: propertyExt;
  buildings: BuildingExt[];
  units: UnitExt[];
}
