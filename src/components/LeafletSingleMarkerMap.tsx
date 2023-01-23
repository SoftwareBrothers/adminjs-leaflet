import React, { useMemo } from 'react';
import { MapContainer, TileLayer, TileLayerProps } from 'react-leaflet';
import { LatLngExpression, MapOptions } from 'leaflet';
import { flat, PropertyPlace, RecordJSON } from 'adminjs';

import MarkerRecord from './LeafletSingleMarkerMapMarkerRecord';
import NewMarker from './LeafletSingleMarkerMapNewMarker';
import { defaultAttribution, defaultTileUrl, defaultZoom } from './utils/defaults';

export type SingleMarkerLeafletMapProps = {
  marker?: RecordJSON;
  mapProps: MapOptions;
  tileProps: TileLayerProps;
  where: PropertyPlace;
  paths: {
    latitudePath: string;
    longitudePath: string;
  };
  onMapClick: (lat: number, lng: number) => void;
  onDragEnd: (lat: number, lng: number) => void;
};

const LeafletSingleMarkerMap: React.FC<SingleMarkerLeafletMapProps> = (props) => {
  const {
    marker,
    mapProps,
    tileProps,
    where,
    paths,
    onDragEnd,
    onMapClick,
  } = props;

  const center = useMemo(() => {
    let center: LatLngExpression = marker
      ? [
        flat.get(marker.params, paths.latitudePath),
        flat.get(marker.params, paths.longitudePath),
      ]
      : [0, 0];

    if (mapProps.center) {
      center = mapProps.center;
    }

    return center;
  }, [marker, mapProps]);

  const canCreateMarker = useMemo(() => {
    const isEdit = where === 'edit';
    const hasLatitude = flat.get(marker?.params ?? {}, paths.latitudePath);
    const hasLongitude = flat.get(marker?.params ?? {}, paths.longitudePath);

    return isEdit && (!hasLatitude || !hasLongitude);
  }, [where, marker, paths]);

  if (!marker) {
    return null;
  }

  return (
    <MapContainer style={{ height: '480px' }} {...mapProps} zoom={mapProps.zoom ?? defaultZoom} center={center}>
      <TileLayer
        {...tileProps}
        attribution={tileProps.attribution ?? defaultAttribution}
        url={tileProps.url ?? defaultTileUrl}
      />
      <NewMarker isEnabled={canCreateMarker} onClick={onMapClick} />
      <MarkerRecord paths={paths} where={where} record={marker} onDragEnd={onDragEnd} />
    </MapContainer>
  );
};

export default LeafletSingleMarkerMap;
