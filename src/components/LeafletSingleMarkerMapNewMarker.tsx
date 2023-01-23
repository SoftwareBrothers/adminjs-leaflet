import React from 'react';
import { useMapEvents } from 'react-leaflet';

type LeafletSingleMarkerMapNewMarkerProps = {
  isEnabled: boolean;
  onClick: (lat: number, lng: number) => void;
}

const LeafletSingleMarkerMapNewMarker: React.FC<LeafletSingleMarkerMapNewMarkerProps> = (props) => {
  const { isEnabled, onClick } = props;

  useMapEvents({
    click: (event) => {
      if (!isEnabled) return;

      const coordinates = event.latlng;
      onClick(coordinates.lat, coordinates.lng);
    },
  });

  return null;
};

export default LeafletSingleMarkerMapNewMarker;
