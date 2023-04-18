import { Box, Button, Icon, Text } from '@adminjs/design-system';
import { flat, PropertyPlace, RecordJSON } from 'adminjs';
import { Marker as HTMLMarker } from 'leaflet';
import React, { useCallback, useMemo, useRef } from 'react';
import { Marker, Popup } from 'react-leaflet';

import type { LeafletMultipleMarkersMapFeatureConfig } from '../multiple-markers.feature.js';

export type LeafletMultipleMarkersMapMarkerRecordProps = {
  record: RecordJSON;
  where: PropertyPlace;
  options: LeafletMultipleMarkersMapFeatureConfig['markerOptions'];
  onEditClick: (marker: RecordJSON) => void;
  onDeleteClick: (marker: RecordJSON) => Promise<void>;
  onDragEnd: (marker: RecordJSON, lat: number, lng: number) => Promise<void>;
};

const LeafletMultipleMarkersMapMarkerRecord: React.FC<LeafletMultipleMarkersMapMarkerRecordProps> = (props) => {
  const { record, options, where, onEditClick, onDragEnd, onDeleteClick } = props;
  const { paths } = options;
  const {
    latitudeProperty: latitudePath,
    longitudeProperty: longitudePath,
  } = paths;

  const markerRef = useRef<HTMLMarker>(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const coordinates = marker.getLatLng();
          onDragEnd(record, coordinates.lat, coordinates.lng);
        }
      },
    }),
    [],
  );

  const marker = useMemo(() => {
    const latitude = record ? flat.get(record.params, latitudePath) : null;
    const longitude = record ? flat.get(record.params, longitudePath) : null;
    const isEditable = where === 'edit';

    return { latitude, longitude, content: record.title, isEditable };
  }, [record, where, latitudePath, longitudePath]);

  const handleEdit = useCallback((event: Event) => {
    event.preventDefault();
    onEditClick(record);
  }, [onEditClick, record]);

  const handleDelete = useCallback((event: Event) => {
    event.preventDefault();
    onDeleteClick(record);
  }, [onDeleteClick, record]);

  const hasCoordinates = useMemo(() => marker.latitude && marker.longitude, [marker]);

  if (!hasCoordinates) return null;

  return (
    <Marker
      draggable={marker.isEditable}
      position={[marker.latitude, marker.longitude]}
      ref={markerRef}
      eventHandlers={eventHandlers}
    >
      <Popup minWidth={100}>
        <Box
          flex
          flexDirection="column"
          width="100%"
          justifyContent="center"
          alignItems="center"
        >
          <Text mb="md">{marker.content}</Text>
          {marker.isEditable && (
            <Box flex width="100%" justifyContent="flex-end">
              <Button onClick={handleEdit} size="icon" mr="sm">
                <Icon icon="Edit" size={16} />
              </Button>
              <Button onClick={handleDelete} size="icon" variant="danger">
                <Icon icon="TrashCan" size={16} />
              </Button>
            </Box>
          )}
        </Box>
      </Popup>
    </Marker>
  );
};

export default LeafletMultipleMarkersMapMarkerRecord;
