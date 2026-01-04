import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Building } from '../database/entities/building.entity';
import { CreateBuildingDto } from './dto/create-building.dto';
import { Property } from '../database/entities/property.entity';

@Injectable()
export class BuildingsService {
  constructor(
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
  ) {}

  async create(createBuildingDto: CreateBuildingDto): Promise<Building> {
    const property = await this.propertyRepository.findOne({
      where: { id: createBuildingDto.property_id },
    });

    if (!property) {
      throw new NotFoundException(
        `Property with ID ${createBuildingDto.property_id} not found`,
      );
    }

    const building = this.buildingRepository.create({
      ...createBuildingDto,
      country: createBuildingDto.country || 'Germany',
    });

    return this.buildingRepository.save(building);
  }

  async createMany(createBuildingDtos: CreateBuildingDto[]): Promise<Building[]> {
    const buildings = createBuildingDtos.map((dto) =>
      this.buildingRepository.create({
        ...dto,
        country: dto.country || 'Germany',
      }),
    );

    return this.buildingRepository.save(buildings);
  }

  async findByProperty(propertyId: number): Promise<Building[]> {
    return this.buildingRepository.find({
      where: { property_id: propertyId },
      relations: ['units'],
      order: { created_at: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Building> {
    const building = await this.buildingRepository.findOne({
      where: { id },
      relations: ['property', 'units'],
    });

    if (!building) {
      throw new NotFoundException(`Building with ID ${id} not found`);
    }

    return building;
  }
}
