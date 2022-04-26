import React, { useEffect, useState } from 'react';
import { EditControl } from 'react-leaflet-draw';
import i18n from '../i18n';
import { setDrawToolLocalizations } from './utils';

interface Props {
  onChange: () => void;
}

const SHAPE_COLOR = '#9d27b0';

const DrawTools = (props: Props): JSX.Element | null => {
  const { onChange } = props;
  const [l10nReady, setl10nReady] = useState<boolean>(false);

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
      onCreated={onChange}
      onDeleted={onChange}
      onEdited={onChange}
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
