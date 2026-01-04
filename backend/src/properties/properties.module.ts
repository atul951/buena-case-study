import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertiesController } from './properties.controller';
import { PropertiesService } from './properties.service';
import { Property } from '../database/entities/property.entity';
import { PropertyManager } from '../database/entities/property-manager.entity';
import { Accountant } from '../database/entities/accountant.entity';
import { PdfParserModule } from '../pdf-parser/pdf-parser.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([Property, PropertyManager, Accountant]),
    PdfParserModule,
  ],
  controllers: [PropertiesController],
  providers: [PropertiesService],
  exports: [PropertiesService],
})
export class PropertiesModule {}
