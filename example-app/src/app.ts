/* eslint-disable import/newline-after-import */
/* eslint-disable import/order */
/* eslint-disable import/first */
// eslint-disable-next-line import/newline-after-import
import 'reflect-metadata';
import leafletFeatures, { getLeafletDist } from '@adminjs/leaflet';

import AdminJS, { ComponentLoader } from 'adminjs';
import Plugin from '@adminjs/express';
import * as Adapter from '@adminjs/typeorm';
import express from 'express';
import cors from 'cors';

import datasource from './db/datasource.js';
import { Marker } from './db/marker.entity.js';
import { Map as MapEntity } from './db/map.entity.js';

const PORT = process.env.PORT ?? 8080;

AdminJS.registerAdapter({
  Database: Adapter.Database,
  Resource: Adapter.Resource,
});

const componentLoader = new ComponentLoader();

const start = async () => {
  await datasource.initialize();

  const app = express();
  app.use(cors({ origin: '*' }));
  app.use(express.static('public'));
  app.use(express.static(getLeafletDist()));

  const markerPaths = {
    mapProperty: 'location',
    jsonProperty: 'location',
    latitudeProperty: 'location.coordinates.0',
    longitudeProperty: 'location.coordinates.1',
  };

  const admin = new AdminJS({
    componentLoader,
    assets: {
      styles: ['/leaflet.css'],
    },
    resources: [{
      resource: Marker,
      options: { navigation: { icon: 'Location' } },
      features: [
        leafletFeatures.leafletSingleMarkerMapFeature({
          componentLoader,
          baseValue: { type: 'Point', coordinates: [] },
          paths: markerPaths,
        }),
      ],
    }, {
      resource: MapEntity,
      options: { navigation: { icon: 'Map' } },
      features: [
        leafletFeatures.leafletMultipleMarkersMapFeature({
          componentLoader,
          mapProperty: 'markers',
          markerOptions: {
            resourceId: 'Marker',
            foreignKey: 'mapId',
            paths: markerPaths,
          },
          mapProps: {
            zoom: 7,
            center: [52.237049, 21.017532],
          },
        }),
      ],
    }],
    rootPath: '/',
  });

  admin.watch();

  const router = Plugin.buildRouter(admin);

  app.use(router);

  app.listen(PORT, () => {
    // eslint-disable-next-line no-console
    console.log(`AdminJS available at http://localhost:${PORT}${admin.options.rootPath}`);
  });
};

start();
