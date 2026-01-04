import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Building } from './building.entity';
import { PropertyManager } from './property-manager.entity';
import { Accountant } from './accountant.entity';
import { PropertyDocument } from './property-document.entity';

export enum PropertyType {
  WEG = 'WEG',
  MV = 'MV',
}

@Entity('properties')
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column({
    type: 'enum',
    enum: PropertyType,
  })
  type: PropertyType;

  @Column({ unique: true })
  unique_number: string;

  @Column({ nullable: true })
  property_manager_id: number;

  @ManyToOne(() => PropertyManager, { nullable: true })
  @JoinColumn({ name: 'property_manager_id' })
  property_manager: PropertyManager;

  @Column({ nullable: true })
  accountant_id: number;

  @ManyToOne(() => Accountant, { nullable: true })
  @JoinColumn({ name: 'accountant_id' })
  accountant: Accountant;

  @OneToMany(() => Building, (building) => building.property)
  buildings: Building[];

  @OneToMany(() => PropertyDocument, (document) => document.property)
  documents: PropertyDocument[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
