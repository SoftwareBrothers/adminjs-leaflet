import { DataSource, DataSourceOptions } from 'typeorm';

import { Map as MapEntity } from './map.entity';
import { Marker } from './marker.entity';

const config: DataSourceOptions = {
  type: 'postgres' as const,
  url: process.env.DATABASE_URL,
  synchronize: true,
  logging: true,
  entities: [
    Marker,
    MapEntity,
  ],
};

export default new DataSource(config);
