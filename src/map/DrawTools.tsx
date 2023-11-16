import { RefObject, useEffect, useState, memo } from 'react';
import { EditControl } from 'react-leaflet-draw';
import { FeatureGroup, polygon } from 'leaflet';
import 'leaflet-measure-path';
import { useThrottleCallback } from '@react-hook/throttle';

import i18n from '../i18n';
import {
  convertGeoJSONArrayForLeaflet,
  setDrawToolLocalizations,
} from './utils';
import { MultiPolygon } from 'geojson';

interface Props {
  onChange: () => void;
  featureGroup: RefObject<FeatureGroup>;
  value?: MultiPolygon;
}

const SHAPE_COLOR = '#9d27b0';

const updateComponent = (prevProps: Props, nextProps: Props): boolean => {
  return prevProps !== nextProps;
};

const DrawTools = memo<Props>((props: Props): JSX.Element | null => {
  const { featureGroup, onChange, value } = props;
  const [l10nReady, setl10nReady] = useState<boolean>(false);

  // Fixes the bug in leaflet-draw lib: https://github.com/Leaflet/Leaflet.draw/issues/1026
  // @ts-expect-error this sets the window.type wich is causing the bug mentioned above
  window.type = '';

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
    true,
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

  // If the input field already has data
  // draw it automatically when the component mounts
  const handleExistingInput = () => {
    const group = featureGroup.current;
    const coordinates = value?.coordinates;
    if (group && coordinates) {
      // Create a polygon for each selected area
      coordinates.map((selectedArea) => {
        polygon(convertGeoJSONArrayForLeaflet(selectedArea)).addTo(group);
      });
    }
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
      onMounted={handleExistingInput}
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
          zIndexOffset: 7000,
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
}, updateComponent);

DrawTools.displayName = 'DrawTools';

export default DrawTools;
