import React, { RefObject, useEffect, useState } from 'react';
import { EditControl } from 'react-leaflet-draw';
import { FeatureGroup } from 'leaflet';
import 'leaflet-measure-path';
import { useThrottleCallback } from '@react-hook/throttle';

import i18n from '../i18n';
import { setDrawToolLocalizations } from './utils';

interface Props {
  onChange: () => void;
  featureGroup: RefObject<FeatureGroup>;
}

const SHAPE_COLOR = '#9d27b0';

const DrawTools = (props: Props): JSX.Element | null => {
  const { featureGroup, onChange } = props;
  const [l10nReady, setl10nReady] = useState<boolean>(false);

  const updateAllMeasurements = useThrottleCallback(
    () => {
      const group = featureGroup.current;
      if (group) {
        group.eachLayer((layer) => {
          layer.showMeasurements();
          layer.updateMeasurements();
        });
      }
    },
    60,
    true
  );

  // Used for changes that trigger a change in the saved value.
  const handleChange = () => {
    updateAllMeasurements();
    onChange();
  };

  // Used for changes that should not yet trigger a change in the saved value
  // (that require clicking Save first or that can be undone with a Cancel button)
  // but that also necessitate a refresh of the displayed measurements.
  const handleNonCommittedChange = () => {
    updateAllMeasurements();
  };

  useEffect(() => {
    setDrawToolLocalizations();
    setl10nReady(true);
  }, [i18n.language]);

  if (!l10nReady) {
    return null;
  }

  return (
    <EditControl
      position="topright"
      onCreated={handleChange}
      onDeleted={handleChange}
      onEdited={handleChange}
      onEditMove={handleNonCommittedChange}
      onEditVertex={handleNonCommittedChange}
      onEditStop={handleNonCommittedChange}
      onDeleteStop={handleNonCommittedChange}
      draw={{
        circlemarker: false,
        circle: false,
        marker: false,
        polyline: false,
        polygon: {
          allowIntersection: false,
          showArea: true,
          drawError: {
            color: 'red',
            timeout: 1000,
          },
          shapeOptions: {
            color: SHAPE_COLOR,
            fillOpacity: 0.5,
          },
        },
        rectangle: {
          shapeOptions: {
            color: SHAPE_COLOR,
            fillOpacity: 0.5,
          },
        },
      }}
    />
  );
};

export default DrawTools;
