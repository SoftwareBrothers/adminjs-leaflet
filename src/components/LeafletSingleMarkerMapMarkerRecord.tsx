import React, { useRef, useMemo } from 'react';
import { Marker as HTMLMarker } from 'leaflet';
import { Marker, Popup } from 'react-leaflet';
import { PropertyPlace, RecordJSON, flat } from 'adminjs';

export type LeafletSingleMarkerMapMarkerRecordProps = {
  record: RecordJSON;
  where: PropertyPlace;
  paths: {
    latitudePath: string;
    longitudePath: string;
  };
  onDragEnd: (latitude: number, longitude: number) => void;
}

const LeafletSingleMarkerMapMarkerRecord: React.FC<LeafletSingleMarkerMapMarkerRecordProps> = (props) => {
  const { record, onDragEnd, where, paths } = props;
  const { latitudePath, longitudePath } = paths;

  const marker = useMemo(() => {
    const latitude = record ? flat.get(record.params, latitudePath) : null;
    const longitude = record ? flat.get(record.params, longitudePath) : null;
    const isEditable = where === 'edit';

    return { latitude, longitude, content: record?.title ?? '', isEditable };
  }, [record, where]);

  const markerRef = useRef<HTMLMarker>(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const coordinates = marker.getLatLng();
          onDragEnd(coordinates.lat, coordinates.lng);
        }
      },
    }),
    [],
  );

  const hasCoordinates = useMemo(() => marker.latitude && marker.longitude, [marker]);

  if (!hasCoordinates) return null;

  return (
    <Marker
      draggable={marker.isEditable}
      eventHandlers={eventHandlers}
      position={[marker.latitude, marker.longitude]}
      ref={markerRef}
    >
      <Popup minWidth={90}>
        {marker.content}
      </Popup>
    </Marker>
  );
};

export default LeafletSingleMarkerMapMarkerRecord;
