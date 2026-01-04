import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UnitsController } from './units.controller';
import { UnitsService } from './units.service';
import { Unit } from '../database/entities/unit.entity';
import { Building } from '../database/entities/building.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Unit, Building])],
  controllers: [UnitsController],
  providers: [UnitsService],
  exports: [UnitsService],
})
export class UnitsModule {}
