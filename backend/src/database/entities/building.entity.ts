import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  ManyToOne,
  OneToMany,
  JoinColumn,
} from 'typeorm';
import { Property } from './property.entity';
import { Unit } from './unit.entity';

@Entity('buildings')
export class Building {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  property_id: number;

  @ManyToOne(() => Property, (property) => property.buildings, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'property_id' })
  property: Property;

  @Column()
  name: string;

  @Column()
  street: string;

  @Column()
  house_number: string;

  @Column()
  postal_code: string;

  @Column()
  city: string;

  @Column({ default: 'Germany' })
  country: string;

  @Column({ type: 'text', nullable: true })
  additional_details: string;

  @OneToMany(() => Unit, (unit) => unit.building)
  units: Unit[];

  @CreateDateColumn()
  created_at: Date;
}
