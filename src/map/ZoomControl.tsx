import React from 'react';
import { ZoomControl as LeafletZoomControl } from 'react-leaflet';

import i18n from '../i18n';

const ZoomControl = (): JSX.Element => (
  <LeafletZoomControl
    position="topright"
    zoomInTitle={i18n.t('map.zoomControl.zoomIn', 'Zoom in')}
    zoomOutTitle={i18n.t('map.zoomControl.zoomOut', 'Zoom out')}
  />
);

export default ZoomControl;
