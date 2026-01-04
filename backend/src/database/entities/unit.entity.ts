import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Building } from './building.entity';

export enum UnitType {
  APARTMENT = 'Apartment',
  OFFICE = 'Office',
  GARDEN = 'Garden',
  PARKING = 'Parking',
}

@Entity('units')
export class Unit {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  building_id: number;

  @ManyToOne(() => Building, (building) => building.units, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'building_id' })
  building: Building;

  @Column()
  number: string;

  @Column({
    type: 'enum',
    enum: UnitType,
  })
  type: UnitType;

  @Column({ nullable: true })
  floor: string;

  @Column({ nullable: true })
  entrance: string;

  @Column({ type: 'decimal', precision: 10, scale: 2, nullable: true })
  size: number;

  @Column({ type: 'decimal', precision: 8, scale: 4, nullable: true })
  co_ownership_share: number;

  @Column({ nullable: true })
  construction_year: number;

  @Column({ nullable: true })
  rooms: number;

  @CreateDateColumn()
  created_at: Date;
}
