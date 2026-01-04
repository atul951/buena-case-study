import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BuildingsController, BuildingsByIdController } from './buildings.controller';
import { BuildingsService } from './buildings.service';
import { Building } from '../database/entities/building.entity';
import { Property } from '../database/entities/property.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Building, Property])],
  controllers: [BuildingsController, BuildingsByIdController],
  providers: [BuildingsService],
  exports: [BuildingsService],
})
export class BuildingsModule {}
