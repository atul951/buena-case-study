import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  ParseIntPipe,
} from '@nestjs/common';
import { BuildingsService } from './buildings.service';
import { CreateBuildingDto } from './dto/create-building.dto';

@Controller('properties/:propertyId/buildings')
export class BuildingsController {
  constructor(private readonly buildingsService: BuildingsService) {}

  @Post()
  async create(
    @Param('propertyId', ParseIntPipe) propertyId: number,
    @Body() createBuildingDto: Omit<CreateBuildingDto, 'property_id'>,
  ) {
    return this.buildingsService.create({
      ...createBuildingDto,
      property_id: propertyId,
    });
  }

  @Post('bulk')
  async createMany(
    @Param('propertyId', ParseIntPipe) propertyId: number,
    @Body() createBuildingDtos: Omit<CreateBuildingDto, 'property_id'>[],
  ) {
    const dtos = createBuildingDtos.map((dto) => ({
      ...dto,
      property_id: propertyId,
    }));
    return this.buildingsService.createMany(dtos);
  }

  @Get()
  async findByProperty(@Param('propertyId', ParseIntPipe) propertyId: number) {
    return this.buildingsService.findByProperty(propertyId);
  }
}

@Controller('buildings')
export class BuildingsByIdController {
  constructor(private readonly buildingsService: BuildingsService) {}

  @Get(':id')
  async findOne(@Param('id', ParseIntPipe) id: number) {
    return this.buildingsService.findOne(id);
  }
}
