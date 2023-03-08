import { leafletMultipleMarkersMapFeature } from './multiple-markers.feature.js';
import { leafletSingleMarkerMapFeature } from './single-marker.feature.js';

export * from './components/utils/index.js';
export * from './multiple-markers.feature.js';
export * from './single-marker.feature.js';
export * from './types.js';
export { bundleComponent, ensureFormat, getLeafletDist } from './utils/index.js';

const features = {
  leafletSingleMarkerMapFeature,
  leafletMultipleMarkersMapFeature,
};

export default features;
