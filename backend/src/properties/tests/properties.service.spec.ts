import { Test, TestingModule } from '@nestjs/testing';
import { getRepositoryToken } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { NotFoundException } from '@nestjs/common';
import { PropertiesService } from '../properties.service';
import { Property, PropertyType } from '../../database/entities/property.entity';
import { PropertyManager } from '../../database/entities/property-manager.entity';
import { Accountant } from '../../database/entities/accountant.entity';
import { CreatePropertyDto } from '../dto/create-property.dto';

describe('PropertiesService', () => {
  let service: PropertiesService;
  let propertyRepository: Repository<Property>;
  let propertyManagerRepository: Repository<PropertyManager>;
  let accountantRepository: Repository<Accountant>;

  const mockProperty = {
    id: 1,
    name: 'Test Property',
    type: PropertyType.WEG,
    unique_number: 'PROP-001',
    property_manager_id: 1,
    accountant_id: 1,
    property_manager: null,
    accountant: null,
    buildings: [],
    created_at: new Date(),
    updated_at: new Date(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PropertiesService,
        {
          provide: getRepositoryToken(Property),
          useValue: {
            find: jest.fn(),
            findOne: jest.fn(),
            create: jest.fn(),
            save: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(PropertyManager),
          useValue: {
            find: jest.fn(),
          },
        },
        {
          provide: getRepositoryToken(Accountant),
          useValue: {
            find: jest.fn(),
          },
        },
      ],
    }).compile();

    service = module.get<PropertiesService>(PropertiesService);
    propertyRepository = module.get<Repository<Property>>(getRepositoryToken(Property));
    propertyManagerRepository = module.get<Repository<PropertyManager>>(
      getRepositoryToken(PropertyManager),
    );
    accountantRepository = module.get<Repository<Accountant>>(getRepositoryToken(Accountant));
  });

  describe('create', () => {
    it('should successfully create a property', async () => {
      const createPropertyDto: CreatePropertyDto = {
        name: 'Test Property',
        type: PropertyType.WEG,
        unique_number: 'PROP-001',
        property_manager_id: 1,
        accountant_id: 1,
      };

      jest.spyOn(propertyRepository, 'create').mockReturnValue(mockProperty as any);
      jest.spyOn(propertyRepository, 'save').mockResolvedValue(mockProperty as any);

      const result = await service.create(createPropertyDto);

      expect(propertyRepository.create).toHaveBeenCalledWith(createPropertyDto);
      expect(propertyRepository.save).toHaveBeenCalledWith(mockProperty);
      expect(result).toEqual(mockProperty);
    });

    it('should create a property without property_manager_id and accountant_id', async () => {
      const createPropertyDto: CreatePropertyDto = {
        name: 'Test Property',
        type: PropertyType.MV,
        unique_number: 'PROP-002',
      };

      const propertyWithoutRefs = {
        ...mockProperty,
        property_manager_id: undefined,
        accountant_id: undefined,
      };

      jest.spyOn(propertyRepository, 'create').mockReturnValue(propertyWithoutRefs as any);
      jest.spyOn(propertyRepository, 'save').mockResolvedValue(propertyWithoutRefs as any);

      const result = await service.create(createPropertyDto);

      expect(propertyRepository.create).toHaveBeenCalledWith(createPropertyDto);
      expect(result).toEqual(propertyWithoutRefs);
    });
  });

  describe('findAll', () => {
    it('should return an array of properties', async () => {
      const mockProperties = [mockProperty, { ...mockProperty, id: 2, name: 'Property 2' }];

      jest.spyOn(propertyRepository, 'find').mockResolvedValue(mockProperties as any);

      const result = await service.findAll();

      expect(propertyRepository.find).toHaveBeenCalledWith({
        relations: ['property_manager', 'accountant'],
        order: { created_at: 'DESC' },
      });
      expect(result).toEqual(mockProperties);
    });

    it('should return an empty array when no properties exist', async () => {
      jest.spyOn(propertyRepository, 'find').mockResolvedValue([]);

      const result = await service.findAll();

      expect(result).toEqual([]);
    });
  });

  describe('findOne', () => {
    it('should return a property with relations', async () => {
      jest.spyOn(propertyRepository, 'findOne').mockResolvedValue(mockProperty as any);

      const result = await service.findOne(1);

      expect(propertyRepository.findOne).toHaveBeenCalledWith({
        where: { id: 1 },
        relations: ['property_manager', 'accountant', 'buildings', 'buildings.units'],
      });
      expect(result).toEqual(mockProperty);
    });

    it('should throw NotFoundException when property does not exist', async () => {
      jest.spyOn(propertyRepository, 'findOne').mockResolvedValue(null);

      await expect(service.findOne(999)).rejects.toThrow(
        new NotFoundException('Property with ID 999 not found'),
      );
    });
  });

  describe('update', () => {
    it('should successfully update a property', async () => {
      const updateData: Partial<CreatePropertyDto> = {
        name: 'Updated Property',
      };

      const updatedProperty = { ...mockProperty, ...updateData };

      jest.spyOn(propertyRepository, 'findOne').mockResolvedValue(mockProperty as any);
      jest.spyOn(propertyRepository, 'save').mockResolvedValue(updatedProperty as any);

      const result = await service.update(1, updateData);

      expect(propertyRepository.save).toHaveBeenCalled();
      expect(result).toEqual(updatedProperty);
    });

    it('should throw NotFoundException when trying to update non-existent property', async () => {
      jest.spyOn(propertyRepository, 'findOne').mockResolvedValue(null);

      await expect(service.update(999, { name: 'Updated' })).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('getPropertyManagers', () => {
    it('should return an array of property managers', async () => {
      const mockManagers = [
        { id: 1, name: 'Manager 1' },
        { id: 2, name: 'Manager 2' },
      ];

      jest.spyOn(propertyManagerRepository, 'find').mockResolvedValue(mockManagers as any);

      const result = await service.getPropertyManagers();

      expect(propertyManagerRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockManagers);
    });
  });

  describe('getAccountants', () => {
    it('should return an array of accountants', async () => {
      const mockAccountants = [
        { id: 1, name: 'Accountant 1' },
        { id: 2, name: 'Accountant 2' },
      ];

      jest.spyOn(accountantRepository, 'find').mockResolvedValue(mockAccountants as any);

      const result = await service.getAccountants();

      expect(accountantRepository.find).toHaveBeenCalled();
      expect(result).toEqual(mockAccountants);
    });
  });
});
