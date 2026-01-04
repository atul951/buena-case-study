import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesModule } from './properties/properties.module';
import { BuildingsModule } from './buildings/buildings.module';
import { UnitsModule } from './units/units.module';
import { PdfParserModule } from './pdf-parser/pdf-parser.module';
import { Property } from './database/entities/property.entity';
import { Building } from './database/entities/building.entity';
import { Unit } from './database/entities/unit.entity';
import { PropertyManager } from './database/entities/property-manager.entity';
import { Accountant } from './database/entities/accountant.entity';
import { PropertyDocument } from './database/entities/property-document.entity';

@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true,
    }),
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.DB_HOST || 'localhost',
      port: parseInt(process.env.DB_PORT || '5432'),
      username: process.env.DB_USERNAME || 'postgres',
      password: process.env.DB_PASSWORD || 'postgres',
      database: process.env.DB_NAME || 'buena_properties',
      entities: [Property, Building, Unit, PropertyManager, Accountant, PropertyDocument],
      synchronize: process.env.NODE_ENV !== 'production',
      logging: process.env.NODE_ENV === 'development',
    }),
    PropertiesModule,
    BuildingsModule,
    UnitsModule,
    PdfParserModule,
  ],
})
export class AppModule {}
