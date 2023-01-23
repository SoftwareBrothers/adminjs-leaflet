/* eslint-disable max-len */
import React, { useState, useMemo, useCallback, memo } from 'react';
import { MapContainer, TileLayer, TileLayerProps } from 'react-leaflet';
import { LatLngExpression, MapOptions } from 'leaflet';
import { PropertyPlace, RecordJSON, useResource } from 'adminjs';

import type { LeafletMultipleMarkersMapFeatureConfig } from '../multiple-markers.feature';

import MarkerRecord from './LeafletMultipleMarkersMapMarkerRecord';
import EditMarkerModal from './LeafletMultipleMarkersMapModal';
import NewMarker from './LeafletMultipleMarkersMapNewMarker';
import { defaultAttribution, defaultTileUrl, defaultZoom, defaultCenter } from './utils/defaults';

export type MultipleMarkersLeafletMapProps = {
  mapRecord: RecordJSON;
  markers: RecordJSON[];
  markerOptions: LeafletMultipleMarkersMapFeatureConfig['markerOptions'];
  where: PropertyPlace;
  mapProps: MapOptions;
  tileProps: TileLayerProps;
  onMarkerDrag: (marker: RecordJSON, lat: number, lng: number) => Promise<void>;
  onMarkerDelete: (marker: RecordJSON) => Promise<void>;
  onMarkerSubmit: (marker: RecordJSON) => Promise<void>;
};

const LeafletMultipleMarkersMap: React.FC<
  MultipleMarkersLeafletMapProps
> = (props) => {
  const {
    mapRecord,
    markers = [],
    mapProps,
    tileProps,
    markerOptions,
    where,
    onMarkerDrag,
    onMarkerDelete,
    onMarkerSubmit,
  } = props;
  const [selectedMarker, setSelectedMarker] = useState<Partial<RecordJSON> | null>(null);
  const markerResource = useResource(markerOptions.resourceId);

  const handleMarkerCreate = useCallback((lat: number, lng: number) => {
    const newRecord: Partial<RecordJSON> = {
      params: {
        [markerOptions.paths.latitudeProperty]: lat,
        [markerOptions.paths.longitudeProperty]: lng,
        [markerOptions.foreignKey]: mapRecord.id,
      },
      populated: {},
      errors: {},
      baseError: null,
    };

    setSelectedMarker(newRecord);
  }, [setSelectedMarker]);

  const canCreateMarker = useMemo(() => where === 'edit', [where]);

  const handleClickEdit = useCallback((marker: RecordJSON) => {
    setSelectedMarker(marker);
  }, [setSelectedMarker]);

  const handleMarkerSubmit = useCallback((marker: RecordJSON) => {
    setSelectedMarker(null);
    return onMarkerSubmit(marker);
  }, [setSelectedMarker, onMarkerSubmit]);

  const resetModal = useCallback(() => {
    setSelectedMarker(null);
  }, [setSelectedMarker]);

  let center: LatLngExpression = defaultCenter;

  if (mapProps.center) {
    center = mapProps.center;
  }

  if (!markerResource) {
    throw new Error('Could not determine marker resource');
  }

  return (
    <>
      {selectedMarker && (
        <EditMarkerModal
          record={selectedMarker}
          resource={markerResource}
          where={where}
          markerOptions={markerOptions}
          onMarkerSubmit={handleMarkerSubmit}
          onClose={resetModal}
        />
      )}
      <MapContainer
        style={{ height: '480px', zIndex: 0 }}
        {...mapProps}
        zoom={mapProps.zoom ?? defaultZoom}
        center={center}
      >
        <TileLayer
          {...tileProps}
          attribution={tileProps.attribution ?? defaultAttribution}
          url={tileProps.url ?? defaultTileUrl}
        />
        <NewMarker isEnabled={canCreateMarker} onCreate={handleMarkerCreate} />
        {markers.map((marker) => (
          <MarkerRecord
            key={marker.id}
            record={marker}
            where={where}
            options={markerOptions}
            onEditClick={handleClickEdit}
            onDeleteClick={onMarkerDelete}
            onDragEnd={onMarkerDrag}
          />
        ))}
      </MapContainer>
    </>
  );
};

export default memo(LeafletMultipleMarkersMap);
