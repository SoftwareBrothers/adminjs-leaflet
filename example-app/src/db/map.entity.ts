import { BaseEntity, Column, Entity, OneToMany, PrimaryGeneratedColumn } from 'typeorm';

import type { Marker } from './marker.entity';

@Entity({ name: 'maps' })
export class Map extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  public id!: number;

  @Column({ type: 'varchar', length: 60, name: 'name' })
  public name!: string;

  @OneToMany('Marker', (marker: Marker) => marker.map)
  public markers!: Marker[];
}
