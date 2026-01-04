import axios from 'axios';
import {
  Property,
  PropertyManager,
  Accountant,
  Building,
  Unit,
  CreatePropertyDto,
  BuildingExt,
  UnitExt,
  PdfExtractionResult,
} from '@/types/property';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const propertyApi = {
  getAll: async (): Promise<Property[]> => {
    const response = await api.get('/properties');
    return response.data;
  },

  getById: async (id: number): Promise<Property> => {
    const response = await api.get(`/properties/${id}`);
    return response.data;
  },

  create: async (data: CreatePropertyDto): Promise<Property> => {
    const response = await api.post('/properties', data);
    return response.data;
  },

  update: async (id: number, data: Partial<CreatePropertyDto>): Promise<Property> => {
    const response = await api.put(`/properties/${id}`, data);
    return response.data;
  },

  getManagers: async (): Promise<PropertyManager[]> => {
    const response = await api.get('/properties/managers');
    return response.data;
  },

  getAccountants: async (): Promise<Accountant[]> => {
    const response = await api.get('/properties/accountants');
    return response.data;
  },

  parsePdf: async (file: File): Promise<PdfExtractionResult> => {
    const formData = new FormData();
    formData.append('file', file);
    const response = await api.post('/properties/parse-pdf', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    });
    return response.data;
  },
};

export const buildingApi = {
  getByProperty: async (propertyId: number): Promise<Building[]> => {
    const response = await api.get(`/properties/${propertyId}/buildings`);
    return response.data;
  },

  create: async (propertyId: number, data: Omit<BuildingExt, 'number' | 'name'>): Promise<Building> => {
    const response = await api.post(`/properties/${propertyId}/buildings`, data);
    return response.data;
  },

  createMany: async (propertyId: number, data: Omit<BuildingExt, 'number' | 'name'>[]): Promise<Building[]> => {
    const response = await api.post(`/properties/${propertyId}/buildings/bulk`, data);
    return response.data;
  },
};

export const unitApi = {
  getByBuilding: async (buildingId: number): Promise<Unit[]> => {
    const response = await api.get(`/buildings/${buildingId}/units`);
    return response.data;
  },

  create: async (buildingId: number, data: Omit<UnitExt, 'number' | 'description'>): Promise<Unit> => {
    const response = await api.post(`/buildings/${buildingId}/units`, data);
    return response.data;
  },

  createMany: async (buildingId: number, data: Omit<UnitExt, 'number' | 'description'>[]): Promise<Unit[]> => {
    const response = await api.post(`/buildings/${buildingId}/units/bulk`, data);
    return response.data;
  },
};
