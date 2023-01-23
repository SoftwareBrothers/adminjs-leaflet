/* eslint-disable max-len */
import { ComponentLoader } from 'adminjs';
import { MapOptions } from 'leaflet';
import { TileLayerProps } from 'react-leaflet';

/**
 * Paths specific to your marker record/resource.
 */
export type MarkerPaths = {
  /**
   * Define "jsonProperty" only if your lat/lng are stored in a single JSON field.
   */
  jsonProperty?: string | null;
  /**
   * A property to display the map. It can be an entirely new property name, it can also be
   * the same as "jsonProperty" (it will simply override the default input)
   */
  mapProperty: string;
  /**
   * The path where the feature should search for latitude in your marker record.
   * Example 1: You're using Postgres database and have a "location" field of GeoJSON type "Point", it will be 'location.coordinates.0'
   * Example 2: You have a separate field for latitude in your collection, for example "x", use "x" for "latitudeProperty" then.
   */
  latitudeProperty: string;
  /**
   * The path where the feature should search for longitude in your marker record.
   * Example 1: You're using Postgres database and have a "location" field of GeoJSON type "Point", it will be 'location.coordinates.1'
   * Example 2: You have a separate field for longitude in your collection, for example "x", use "x" for "longitudeProperty" then.
   */
  longitudeProperty: string;
};

export type LeafletFeatureCommonConfig = {
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
}
