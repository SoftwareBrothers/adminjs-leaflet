import { ValueGroup } from '@adminjs/design-system';
import {
  ActionAPIParams, ApiClient, BasePropertyProps, RecordActionAPIParams, RecordJSON, ResourceActionParams,
} from 'adminjs';
import React, { memo, useCallback, useEffect, useMemo, useState } from 'react';

import LeafletMultipleMarkersMap from './LeafletMultipleMarkersMap.js';

const LeafletMultipleMarkersPropertyComponent: React.FC<
  BasePropertyProps
> = (props) => {
  const { property, record, where } = props;
  const { custom } = property;
  const { markerOptions = {}, mapProps = {}, tileProps = {} } = custom;

  const [markers, setMarkers] = useState<RecordJSON[]>([]);

  useEffect(() => {
    getMarkers();
  }, []);

  const api = useMemo(() => new ApiClient(), []);

  const isNewRecord = useMemo(
    () => !record?.id,
    [record],
  );

  const getMarkers = useCallback(async () => {
    if (isNewRecord) {
      return;
    }

    const filterKey = `filters.${markerOptions.foreignKey}`;
    const response = await api.resourceAction({
      resourceId: markerOptions.resourceId,
      actionName: 'list',
      params: {
        perPage: '500',
        [filterKey]: record?.id,
      },
    });

    setMarkers(response.data.records);
  }, [record, setMarkers, api, markerOptions]);

  const handleMarkerDrag = useCallback(
    async (marker: RecordJSON, lat: number, lng: number) => {
      await api.recordAction({
        recordId: marker.id,
        resourceId: markerOptions.resourceId,
        actionName: 'edit',
        data: {
          [markerOptions.paths.latitudeProperty]: lat,
          [markerOptions.paths.longitudeProperty]: lng,
        },
      });

      getMarkers();
    },
    [api, markerOptions, getMarkers],
  );

  const handleMarkerDelete = useCallback(async (marker: RecordJSON) => {
    await api.recordAction({
      recordId: marker.id,
      resourceId: markerOptions.resourceId,
      actionName: 'delete',
      method: 'post',
    });

    getMarkers();
  }, [api, markerOptions, getMarkers]);

  const handleMarkerSubmit = useCallback(async (marker: RecordJSON) => {
    const params: Partial<ActionAPIParams> = {
      resourceId: markerOptions.resourceId,
      data: marker.params,
    };

    if (marker.id) {
      params.actionName = 'edit';
      (params as RecordActionAPIParams).recordId = marker.id;

      await api.recordAction(params as RecordActionAPIParams);
    } else {
      params.actionName = 'new';

      await api.resourceAction(params as ResourceActionParams);
    }

    getMarkers();
  }, [api, markerOptions, getMarkers]);

  if (isNewRecord) {
    return null;
  }

  return (
    <ValueGroup label={property.label}>
      <LeafletMultipleMarkersMap
        mapRecord={record as RecordJSON}
        markers={markers}
        where={where}
        markerOptions={markerOptions}
        mapProps={mapProps}
        tileProps={tileProps}
        onMarkerDrag={handleMarkerDrag}
        onMarkerDelete={handleMarkerDelete}
        onMarkerSubmit={handleMarkerSubmit}
      />
    </ValueGroup>
  );
};

export default memo(LeafletMultipleMarkersPropertyComponent);
