import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { UnitsService } from './units.service';
import { CreateUnitDto } from './dto/create-unit.dto';

@Controller('buildings/:buildingId/units')
export class UnitsController {
  constructor(private readonly unitsService: UnitsService) {}

  @Post()
  async create(
    @Param('buildingId', ParseIntPipe) buildingId: number,
    @Body() createUnitDto: Omit<CreateUnitDto, 'building_id'>,
  ) {
    return this.unitsService.create({
      ...createUnitDto,
      building_id: buildingId,
    });
  }

  @Post('bulk')
  async createMany(
    @Param('buildingId', ParseIntPipe) buildingId: number,
    @Body() createUnitDtos: Omit<CreateUnitDto, 'building_id'>[],
  ) {
    const dtos = createUnitDtos.map((dto) => ({
      ...dto,
      building_id: buildingId,
    }));
    return this.unitsService.createMany(dtos);
  }

  @Get()
  async findByBuilding(@Param('buildingId', ParseIntPipe) buildingId: number) {
    return this.unitsService.findByBuilding(buildingId);
  }
}
