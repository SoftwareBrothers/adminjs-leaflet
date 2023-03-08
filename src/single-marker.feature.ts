/* eslint-disable max-len */
import { buildFeature, FeatureType } from 'adminjs';

import { LeafletFeatureCommonConfig, MarkerPaths } from './types.js';
import { bundleComponent, ensureFormat } from './utils/index.js';

export type LeafletSingleMarkerMapFeatureConfig = LeafletFeatureCommonConfig & {
  /**
   * An optional option to provide a default value for your location field. It is only neccessary
   * if your location field is not a primitive value, for example a GeoJSON Point.
   * The correct payload for GeoJSON point looks like this:
   *
   * ```location: { type: 'Point', coordinates: [0, 0] }```
   *
   * However, the map UI doesn't know it needs to add "type: 'Point'" and the payload it sends only
   * contains coordinates, example:
   *
   * ```location: { coordinates: [0, 0] }```
   *
   * To fix this, provide "baseValue" and it will be merged with payload sent from the frontend.
   *
   * Example:
   * ```baseValue: { type: 'Point', coordinates: [] }```
   *
   * If your table has separate fields for latitude/longitude or it's just a simple JSON, you do not need
   * to define "baseValue".
   */
  baseValue?: Record<string, any>;
  paths: MarkerPaths;
}

export const leafletSingleMarkerMapFeature = ({
  componentLoader,
  baseValue,
  paths: {
    jsonProperty = null,
    mapProperty,
    latitudeProperty,
    longitudeProperty,
  },
  mapProps,
  tileProps,
}: LeafletSingleMarkerMapFeatureConfig): FeatureType => {
  const singleMarkerComponent = bundleComponent(componentLoader, 'LeafletSingleMarkerMapPropertyComponent');

  return buildFeature({
    actions: {
      new: {
        before: [ensureFormat(jsonProperty ?? null, baseValue)],
      },
      edit: {
        before: [ensureFormat(jsonProperty ?? null, baseValue)],
      },
    },
    properties: {
      [mapProperty]: {
        components: {
          show: singleMarkerComponent,
          edit: singleMarkerComponent,
        },
        custom: {
          latitudeProperty,
          longitudeProperty,
          mapProps,
          tileProps,
        },
      },
    },
  });
};
