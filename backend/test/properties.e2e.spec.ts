import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication, ValidationPipe } from '@nestjs/common';
import request from 'supertest';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesModule } from '../src/properties/properties.module';
import { BuildingsModule } from '../src/buildings/buildings.module';
import { UnitsModule } from '../src/units/units.module';
import { PdfParserModule } from '../src/pdf-parser/pdf-parser.module';
import { Property, PropertyType } from '../src/database/entities/property.entity';
import { PropertyManager } from '../src/database/entities/property-manager.entity';
import { Accountant } from '../src/database/entities/accountant.entity';
import { Building } from '../src/database/entities/building.entity';
import { Unit } from '../src/database/entities/unit.entity';
import { PropertyDocument } from '../src/database/entities/property-document.entity';

describe('Properties Create Flow (e2e)', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot({
          type: 'postgres',
          host: process.env.DB_HOST || 'localhost',
          port: parseInt(process.env.DB_PORT || '5432'),
          username: process.env.DB_USER || 'postgres',
          password: process.env.DB_PASSWORD || 'postgres',
          database: process.env.DB_NAME || 'buena_test',
          entities: [Property, PropertyManager, Accountant, Building, Unit, PropertyDocument],
          synchronize: true,
          dropSchema: true,
        }),
        PropertiesModule,
        BuildingsModule,
        UnitsModule,
        PdfParserModule,
      ],
    }).compile();

    app = moduleFixture.createNestApplication();
    app.useGlobalPipes(new ValidationPipe());
    await app.init();
  });

  afterAll(async () => {
    await app.close();
  });

  describe('POST /properties', () => {
    it('should successfully create a property with all required fields', async () => {
      const createPropertyDto = {
        name: 'Integration Test Property',
        type: PropertyType.WEG,
        unique_number: 'TEST-PROP-001',
      };

      const response = await request(app.getHttpServer())
        .post('/properties')
        .send(createPropertyDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toBe(createPropertyDto.name);
      expect(response.body.type).toBe(createPropertyDto.type);
      expect(response.body.unique_number).toBe(createPropertyDto.unique_number);
    });

    it('should successfully create a property with optional manager and accountant IDs', async () => {
      const createPropertyDto = {
        name: 'Property with Manager',
        type: PropertyType.MV,
        unique_number: 'TEST-PROP-002',
        property_manager_id: 1,
        accountant_id: 1,
      };

      const response = await request(app.getHttpServer())
        .post('/properties')
        .send(createPropertyDto)
        .expect(201);

      expect(response.body).toHaveProperty('id');
      expect(response.body.property_manager_id).toBe(createPropertyDto.property_manager_id);
      expect(response.body.accountant_id).toBe(createPropertyDto.accountant_id);
    });

    it('should fail when required name field is missing', async () => {
      const invalidDto = {
        type: PropertyType.WEG,
        unique_number: 'TEST-PROP-003',
      };

      const response = await request(app.getHttpServer())
        .post('/properties')
        .send(invalidDto)
        .expect(400);

      expect(response.body.message).toContain('name');
    });

    it('should fail when required type field is missing', async () => {
      const invalidDto = {
        name: 'Test Property',
        unique_number: 'TEST-PROP-004',
      };

      const response = await request(app.getHttpServer())
        .post('/properties')
        .send(invalidDto)
        .expect(400);

      expect(response.body.message).toContain('type');
    });

    it('should fail when required unique_number field is missing', async () => {
      const invalidDto = {
        name: 'Test Property',
        type: PropertyType.WEG,
      };

      const response = await request(app.getHttpServer())
        .post('/properties')
        .send(invalidDto)
        .expect(400);

      expect(response.body.message).toContain('unique_number');
    });

    it('should fail when invalid PropertyType is provided', async () => {
      const invalidDto = {
        name: 'Test Property',
        type: 'INVALID_TYPE',
        unique_number: 'TEST-PROP-005',
      };

      const response = await request(app.getHttpServer())
        .post('/properties')
        .send(invalidDto)
        .expect(400);

      expect(response.body.message).toContain('type');
    });

    it('should fail when unique_number violates unique constraint', async () => {
      const createPropertyDto = {
        name: 'First Property',
        type: PropertyType.WEG,
        unique_number: 'TEST-PROP-DUPLICATE',
      };

      // Create first property
      await request(app.getHttpServer()).post('/properties').send(createPropertyDto).expect(201);

      // Try to create another with the same unique_number
      const response = await request(app.getHttpServer())
        .post('/properties')
        .send(createPropertyDto)
        .expect(500);

      expect(response.body.message).toBeDefined();
    });
  });

  describe('GET /properties', () => {
    it('should retrieve all created properties', async () => {
      const response = await request(app.getHttpServer()).get('/properties').expect(200);

      expect(Array.isArray(response.body)).toBe(true);
      expect(response.body.length).toBeGreaterThan(0);
    });
  });

  describe('GET /properties/:id', () => {
    it('should retrieve a specific property by ID', async () => {
      // Create a property first
      const createPropertyDto = {
        name: 'Property to Retrieve',
        type: PropertyType.MV,
        unique_number: 'TEST-PROP-RETRIEVE',
      };

      const createResponse = await request(app.getHttpServer())
        .post('/properties')
        .send(createPropertyDto)
        .expect(201);

      const propertyId = createResponse.body.id;

      // Retrieve the property
      const getResponse = await request(app.getHttpServer())
        .get(`/properties/${propertyId}`)
        .expect(200);

      expect(getResponse.body.id).toBe(propertyId);
      expect(getResponse.body.name).toBe(createPropertyDto.name);
      expect(getResponse.body.type).toBe(createPropertyDto.type);
    });

    it('should return 404 when property does not exist', async () => {
      await request(app.getHttpServer())
        .get('/properties/99999')
        .expect(404);
    });
  });

  describe('GET /properties/managers', () => {
    it('should retrieve property managers list', async () => {
      const response = await request(app.getHttpServer())
        .get('/properties/managers')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });

  describe('GET /properties/accountants', () => {
    it('should retrieve accountants list', async () => {
      const response = await request(app.getHttpServer())
        .get('/properties/accountants')
        .expect(200);

      expect(Array.isArray(response.body)).toBe(true);
    });
  });
});
