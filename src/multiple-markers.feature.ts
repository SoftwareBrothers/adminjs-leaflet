/* eslint-disable max-len */
import { buildFeature, ComponentLoader, FeatureType } from 'adminjs';
import type { MapOptions } from 'leaflet';
import type { TileLayerProps } from 'react-leaflet';

import { MarkerPaths } from './types.js';
import { bundleComponent } from './utils/index.js';

export type LeafletMultipleMarkersMapFeatureConfig = {
  /**
   * Your ComponentLoader instance. It is required for the feature to add it's components.
   */
  componentLoader: ComponentLoader;
  /**
   * Props for Leaflet's MapContainer: https://react-leaflet.js.org/docs/v3/api-map/#mapcontainer
   */
  mapProps?: MapOptions;
  /**
   * Props for Leaflet's TileLayer: https://react-leaflet.js.org/docs/v3/api-components/#tilelayer
   */
  tileProps?: TileLayerProps;
  /**
   * Property name used to display your map of markers.
   */
  mapProperty: string;
  markerOptions: {
    resourceId: string;
    foreignKey: string;
    paths: MarkerPaths;
  };
}

export const leafletMultipleMarkersMapFeature = ({
  componentLoader,
  mapProps,
  tileProps,
  markerOptions,
  mapProperty,
}: LeafletMultipleMarkersMapFeatureConfig): FeatureType => {
  const multipleMarkersComponent = bundleComponent(componentLoader, 'LeafletMultipleMarkersMapPropertyComponent');

  return buildFeature({
    properties: {
      [mapProperty]: {
        components: {
          show: multipleMarkersComponent,
          edit: multipleMarkersComponent,
        },
        custom: {
          markerOptions,
          mapProps,
          tileProps,
        },
      },
    },
  });
};
