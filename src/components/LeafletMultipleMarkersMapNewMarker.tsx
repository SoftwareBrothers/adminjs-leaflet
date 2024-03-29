import { LatLngTuple, Marker as HTMLMarker } from 'leaflet';
import React, { useState, useRef, useMemo, useCallback, memo } from 'react';
import { useMapEvents, Marker, Popup } from 'react-leaflet';
import { Button, Icon } from '@adminjs/design-system';
import { useTranslation } from 'adminjs';

type LeafletMultipleMarkersMapNewMarkerProps = {
  isEnabled: boolean;
  onCreate(lat: number, lng: number): void;
}

const LeafletMultipleMarkersMapNewMarker: React.FC<LeafletMultipleMarkersMapNewMarkerProps> = (props) => {
  const { isEnabled, onCreate } = props;
  const [position, setPosition] = useState<LatLngTuple | null>(null);
  const { translateButton } = useTranslation();

  useMapEvents({
    click: (event) => {
      if (!isEnabled) return;

      const coordinates = event.latlng;
      setPosition([coordinates.lat, coordinates.lng]);
    },
  });

  const markerRef = useRef<HTMLMarker>(null);
  const eventHandlers = useMemo(
    () => ({
      dragend() {
        const marker = markerRef.current;
        if (marker != null) {
          const coordinates = marker.getLatLng();
          setPosition([coordinates.lat, coordinates.lng]);
        }
      },
    }),
    [],
  );

  const handleCreate = useCallback((event: Event) => {
    event.stopPropagation();
    if (!position) return;

    const [lat, lng] = [...position];
    setPosition(null);
    onCreate(lat, lng);
  }, [onCreate, position, setPosition]);

  if (!position) {
    return null;
  }

  return (
    <Marker
      draggable
      position={position}
      ref={markerRef}
      eventHandlers={eventHandlers}
    >
      <Popup minWidth={150}>
        <Button onClick={handleCreate} size="md" variant="text" width="100%">
          <Icon icon="PlusCircle" size={16} />
          {translateButton('create')}
        </Button>
      </Popup>
    </Marker>
  );
};

export default memo(LeafletMultipleMarkersMapNewMarker);
