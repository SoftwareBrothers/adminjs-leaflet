/* eslint-disable max-len */
import {
  Box, Button, DrawerContent,
  DrawerFooter, Modal,
} from '@adminjs/design-system';
import {
  BasePropertyComponent, PropertyPlace, RecordJSON,
  ResourceJSON, useRecord, useTranslation,
} from 'adminjs';
import React, { useCallback, useMemo } from 'react';
import { styled } from '@adminjs/design-system/styled-components';

import type { LeafletMultipleMarkersMapFeatureConfig } from '../multiple-markers.feature.js';

const StyledModal = styled(Modal)`
  z-index: 9999;
  position: absolute;
`;

export type LeafletMultipleMarkersMapModalProps = {
  record: Partial<RecordJSON> | null;
  resource: ResourceJSON;
  where: PropertyPlace;
  markerOptions: LeafletMultipleMarkersMapFeatureConfig['markerOptions'];
  onMarkerSubmit: (marker: RecordJSON) => Promise<void>;
  onClose: () => void;
};

const LeafletMultipleMarkersMapModal: React.FC<
  LeafletMultipleMarkersMapModalProps
> = (props) => {
  const {
    record: initialRecord,
    resource,
    markerOptions,
    where,
    onMarkerSubmit,
    onClose,
  } = props;
  const {
    latitudeProperty: latPath,
    longitudeProperty: lngPath,
    mapProperty: markerMapPath,
  } = markerOptions.paths;
  const { translateButton } = useTranslation();
  const { record, handleChange } = useRecord(
    (initialRecord as any) ?? undefined,
    resource.id,
  );

  const submit = useCallback(
    (event: React.FormEvent<HTMLFormElement>) => {
      event.stopPropagation();
      onMarkerSubmit(record);
    },
    [record, onMarkerSubmit],
  );

  const editPropertiesWithDisabledCoordinates = useMemo(
    () => (resource?.editProperties ?? [])
      .map((property) => {
        if (property.propertyPath === markerOptions.foreignKey) {
          property.isDisabled = true;
        }

        return property;
      })
      .filter((property) => {
        if (
          [latPath, lngPath, markerMapPath].includes(property.propertyPath)
        ) {
          return false;
        }

        return true;
      }),
    [resource, markerOptions],
  );

  const isModalOpen = useMemo(
    () => record && where === 'edit',
    [where, record],
  );

  if (!isModalOpen) {
    return null;
  }

  return (
    <StyledModal
      title={record.title}
      icon="Edit"
      onOverlayClick={onClose}
      onClose={onClose}
    >
      <Box flex flexDirection="column">
        <DrawerContent>
          {editPropertiesWithDisabledCoordinates.map((property) => (
            <BasePropertyComponent
              key={property.propertyPath}
              where="edit"
              onChange={handleChange}
              property={property}
              resource={resource}
              record={record as RecordJSON}
            />
          ))}
        </DrawerContent>
        <DrawerFooter>
          <Button variant="primary" size="lg" onClick={submit}>
            {translateButton('save', resource.id)}
          </Button>
        </DrawerFooter>
      </Box>
    </StyledModal>
  );
};

export default LeafletMultipleMarkersMapModal;
