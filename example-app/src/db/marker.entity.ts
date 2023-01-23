import { BaseEntity, Column, Entity, Index, JoinColumn, ManyToOne, PrimaryGeneratedColumn } from 'typeorm';
import { Point } from 'geojson';

import type { Map as MapEntity } from './map.entity';

@Entity({ name: 'markers' })
export class Marker extends BaseEntity {
  @PrimaryGeneratedColumn({ type: 'bigint', name: 'id' })
  public id!: number;

  @Column({ type: 'varchar', length: 60, name: 'name' })
  public name!: string;

  @Index({ spatial: true })
  @Column({
    type: 'geography',
    spatialFeatureType: 'Point',
    srid: 4326,
    nullable: false,
  })
  public location!: Point;

  @Column({ name: 'map_id', type: 'bigint', nullable: true })
  @Index()
  public mapId!: number | null;

  @ManyToOne('Map', { onDelete: 'SET NULL' })
  @JoinColumn({ name: 'map_id' })
  public map!: MapEntity;
}
