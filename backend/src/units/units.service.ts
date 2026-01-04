import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Unit } from '../database/entities/unit.entity';
import { CreateUnitDto } from './dto/create-unit.dto';
import { Building } from '../database/entities/building.entity';

@Injectable()
export class UnitsService {
  constructor(
    @InjectRepository(Unit)
    private unitRepository: Repository<Unit>,
    @InjectRepository(Building)
    private buildingRepository: Repository<Building>,
  ) {}

  async create(createUnitDto: CreateUnitDto): Promise<Unit> {
    const building = await this.buildingRepository.findOne({
      where: { id: createUnitDto.building_id },
    });

    if (!building) {
      throw new NotFoundException(
        `Building with ID ${createUnitDto.building_id} not found`,
      );
    }

    const unit = this.unitRepository.create(createUnitDto);
    return this.unitRepository.save(unit);
  }

  async createMany(createUnitDtos: CreateUnitDto[]): Promise<Unit[]> {
    // Validate all buildings exist
    const buildingIds = [...new Set(createUnitDtos.map((dto) => dto.building_id))];
      const buildings = await this.buildingRepository.find({
        where: buildingIds.map((id) => ({ id })),
      });
  
      if (buildings.length !== buildingIds.length) {
        throw new NotFoundException('One or more buildings not found');
      }
  
      const units = createUnitDtos.map((dto) => this.unitRepository.create(dto));
      return this.unitRepository.save(units);
    
  }

  async findByBuilding(buildingId: number): Promise<Unit[]> {
    return this.unitRepository.find({
      where: { building_id: buildingId },
      order: { number: 'ASC' },
    });
  }

  async findOne(id: number): Promise<Unit> {
    const unit = await this.unitRepository.findOne({
      where: { id },
      relations: ['building'],
    });

    if (!unit) {
      throw new NotFoundException(`Unit with ID ${id} not found`);
    }

    return unit;
  }
}
