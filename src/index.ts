import { leafletSingleMarkerMapFeature } from './single-marker.feature';
import { leafletMultipleMarkersMapFeature } from './multiple-markers.feature';

export * from './single-marker.feature';
export * from './multiple-markers.feature';
export { getLeafletDist, ensureFormat, bundleComponent } from './utils';
export * from './types';
export * from './components/utils';

const features = {
  leafletSingleMarkerMapFeature,
  leafletMultipleMarkersMapFeature,
};

export default features;
