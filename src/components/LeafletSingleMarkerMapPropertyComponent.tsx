import { ValueGroup } from '@adminjs/design-system';
import { BasePropertyProps } from 'adminjs';
import React, { memo, useCallback, useMemo } from 'react';

import LeafletSingleMarkerMap from './LeafletSingleMarkerMap.js';

const LeafletSingleMarkerPropertyComponent: React.FC<BasePropertyProps> = (props) => {
  const { property, record, where, onChange } = props;
  const { custom } = property;
  const {
    latitudeProperty: latitudePath,
    longitudeProperty: longitudePath,
    mapProps = {},
    tileProps = {},
  } = custom;

  const handleDragEnd = useCallback((lat: number, lng: number) => {
    if (where === 'edit' && onChange) {
      onChange(latitudePath, lat);
      onChange(longitudePath, lng);
    }
  }, [where, onChange]);

  const handleMapClick = useCallback((lat: number, lng: number) => {
    if (where === 'edit' && onChange) {
      onChange(latitudePath, lat);
      onChange(longitudePath, lng);
    }
  }, [where, onChange]);

  const paths = useMemo(() => ({
    latitudePath,
    longitudePath,
  }), [latitudePath, longitudePath]);

  return (
    <ValueGroup label={property.label}>
      <LeafletSingleMarkerMap
        marker={record}
        paths={paths}
        where={where}
        mapProps={mapProps}
        tileProps={tileProps}
        onDragEnd={handleDragEnd}
        onMapClick={handleMapClick}
      />
    </ValueGroup>
  );
};

export default memo(LeafletSingleMarkerPropertyComponent);
