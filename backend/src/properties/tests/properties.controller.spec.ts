import { Test, TestingModule } from '@nestjs/testing';
import { PropertiesController } from '../properties.controller';
import { PropertiesService } from '../properties.service';
import { PdfParserService } from '../../pdf-parser/pdf-parser.service';
import { CreatePropertyDto } from '../dto/create-property.dto';
import { PropertyType } from '../../database/entities/property.entity';

describe('PropertiesController', () => {
  let controller: PropertiesController;
  let service: PropertiesService;

  const mockProperty = {
    id: 1,
    name: 'Test Property',
    type: PropertyType.WEG,
    unique_number: 'PROP-001',
    property_manager_id: 1,
    accountant_id: 1,
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [PropertiesController],
      providers: [
        {
          provide: PropertiesService,
          useValue: {
            create: jest.fn(),
            findAll: jest.fn(),
            findOne: jest.fn(),
            update: jest.fn(),
            getPropertyManagers: jest.fn(),
            getAccountants: jest.fn(),
          },
        },
        {
          provide: PdfParserService,
          useValue: {
            extractDataFromPdf: jest.fn(),
          },
        },
      ],
    }).compile();

    controller = module.get<PropertiesController>(PropertiesController);
    service = module.get<PropertiesService>(PropertiesService);
  });

  describe('create', () => {
    it('should call service.create with the correct DTO', async () => {
      const createPropertyDto: CreatePropertyDto = {
        name: 'Test Property',
        type: PropertyType.WEG,
        unique_number: 'PROP-001',
        property_manager_id: 1,
        accountant_id: 1,
      };

      jest.spyOn(service, 'create').mockResolvedValue(mockProperty as any);

      const result = await controller.create(createPropertyDto);

      expect(service.create).toHaveBeenCalledWith(createPropertyDto);
      expect(result).toEqual(mockProperty);
    });

    it('should successfully create a property without optional fields', async () => {
      const createPropertyDto: CreatePropertyDto = {
        name: 'Test Property',
        type: PropertyType.MV,
        unique_number: 'PROP-002',
      };

      const createdProperty = {
        id: 2,
        ...createPropertyDto,
        property_manager_id: null,
        accountant_id: null,
      };

      jest.spyOn(service, 'create').mockResolvedValue(createdProperty as any);

      const result = await controller.create(createPropertyDto);

      expect(service.create).toHaveBeenCalledWith(createPropertyDto);
      expect(result).toEqual(createdProperty);
    });
  });

  describe('findAll', () => {
    it('should return an array of properties', async () => {
      const mockProperties = [mockProperty];

      jest.spyOn(service, 'findAll').mockResolvedValue(mockProperties as any);

      const result = await controller.findAll();

      expect(service.findAll).toHaveBeenCalled();
      expect(result).toEqual(mockProperties);
    });
  });

  describe('findOne', () => {
    it('should return a property by ID', async () => {
      jest.spyOn(service, 'findOne').mockResolvedValue(mockProperty as any);

      const result = await controller.findOne(1);

      expect(service.findOne).toHaveBeenCalledWith(1);
      expect(result).toEqual(mockProperty);
    });
  });

  describe('update', () => {
    it('should call service.update with correct parameters', async () => {
      const updatePropertyDto: Partial<CreatePropertyDto> = {
        name: 'Updated Property',
      };

      const updatedProperty = { ...mockProperty, ...updatePropertyDto };

      jest.spyOn(service, 'update').mockResolvedValue(updatedProperty as any);

      const result = await controller.update(1, updatePropertyDto);

      expect(service.update).toHaveBeenCalledWith(1, updatePropertyDto);
      expect(result).toEqual(updatedProperty);
    });
  });

  describe('getPropertyManagers', () => {
    it('should return property managers', async () => {
      const mockManagers = [{ id: 1, name: 'Manager 1' }];

      jest.spyOn(service, 'getPropertyManagers').mockResolvedValue(mockManagers as any);

      const result = await controller.getPropertyManagers();

      expect(service.getPropertyManagers).toHaveBeenCalled();
      expect(result).toEqual(mockManagers);
    });
  });

  describe('getAccountants', () => {
    it('should return accountants', async () => {
      const mockAccountants = [{ id: 1, name: 'Accountant 1' }];

      jest.spyOn(service, 'getAccountants').mockResolvedValue(mockAccountants as any);

      const result = await controller.getAccountants();

      expect(service.getAccountants).toHaveBeenCalled();
      expect(result).toEqual(mockAccountants);
    });
  });
});
