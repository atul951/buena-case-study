import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Property } from '../database/entities/property.entity';
import { CreatePropertyDto } from './dto/create-property.dto';
import { PropertyManager } from '../database/entities/property-manager.entity';
import { Accountant } from '../database/entities/accountant.entity';

@Injectable()
export class PropertiesService {
  constructor(
    @InjectRepository(Property)
    private propertyRepository: Repository<Property>,
    @InjectRepository(PropertyManager)
    private propertyManagerRepository: Repository<PropertyManager>,
    @InjectRepository(Accountant)
    private accountantRepository: Repository<Accountant>,
  ) {}

  async findAll(): Promise<Property[]> {
    return this.propertyRepository.find({
      relations: ['property_manager', 'accountant'],
      order: { created_at: 'DESC' },
    });
  }

  async findOne(id: number): Promise<Property> {
    const property = await this.propertyRepository.findOne({
      where: { id },
      relations: ['property_manager', 'accountant', 'buildings', 'buildings.units'],
    });

    if (!property) {
      throw new NotFoundException(`Property with ID ${id} not found`);
    }

    return property;
  }

  async create(createPropertyDto: CreatePropertyDto): Promise<Property> {
    const property = this.propertyRepository.create(createPropertyDto);
    return this.propertyRepository.save(property);
  }

  async update(id: number, updateData: Partial<CreatePropertyDto>): Promise<Property> {
    const property = await this.findOne(id);
    Object.assign(property, updateData);
    return this.propertyRepository.save(property);
  }

  async getPropertyManagers(): Promise<PropertyManager[]> {
    return this.propertyManagerRepository.find();
  }

  async getAccountants(): Promise<Accountant[]> {
    return this.accountantRepository.find();
  }
}
