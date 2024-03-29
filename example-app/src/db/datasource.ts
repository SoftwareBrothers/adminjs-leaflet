import { DataSource, DataSourceOptions } from 'typeorm';

import { Map as MapEntity } from './map.entity.js';
import { Marker } from './marker.entity.js';

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
