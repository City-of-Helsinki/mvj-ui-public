import { useRef } from 'react';
import { MapContainer, GeoJSON } from 'react-leaflet';
import 'proj4leaflet';
import { useTranslation } from 'react-i18next';

import { attachMapResizeObserver, getCentroid } from '../../map/utils';
import { initializeHelsinkiMap } from '../../map/utils';
import { StandardMapLayer } from '../../map/StandardMapLayersControl';
import { MapLayer, MapLayers } from '../../map/types';
import { AreaSearch } from '../types';
import MapReadyHandler from '../../map/MapReadyHandler';

interface Props {
  target: AreaSearch;
}

const AreaSearchTargetSummaryMap = ({ target }: Props): JSX.Element => {
  const { latLonBounds, CRS } = initializeHelsinkiMap();
  const { t } = useTranslation();
  const geoJson = useRef<L.GeoJSON>(null);
  const coordinates =
    target?.geometry?.type === 'MultiPolygon' && target?.geometry;

  if (!coordinates) {
    // TODO: A better placeholder here...
    return (
      <div>{t('favouritesPage.map.notAvailable', 'Map not available')}</div>
    );
  }

  const mapCreated = (map: L.Map): void => {
    attachMapResizeObserver(map);
    if (geoJson.current) {
      map.fitBounds(geoJson.current.getBounds());
    }
  };

  const centroid = getCentroid(coordinates);

  return (
    <MapContainer
      className="AreaSearchTargetSummaryMap"
      center={centroid || undefined}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      maxBounds={latLonBounds}
      bounds={latLonBounds}
      crs={CRS}
      zoomControl={false}
    >
      <MapReadyHandler whenCreated={mapCreated} />
      <StandardMapLayer layerData={MapLayers[MapLayer.generalMap]} />
      <GeoJSON ref={geoJson} style={{ weight: 3 }} data={coordinates} />
    </MapContainer>
  );
};

export default AreaSearchTargetSummaryMap;
