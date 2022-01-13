import React from 'react';
import { MapContainer, WMSTileLayer, Marker } from 'react-leaflet';
import 'proj4leaflet';
import { PlotSearchTarget } from '../../plotSearch/types';
import { getCentroid } from '../../plotSearchAndCompetitionsPage/utils';
import { getMarkerIcon } from '../../plotSearchAndCompetitionsPage/components/mapPlotSearchOverlay';
import { initializeHelsinkiMap } from '../../plotSearchAndCompetitionsPage/utils';
import { whenMapCreated } from '../../plotSearchAndCompetitionsPage/components/mapComponent';

interface Props {
  target: PlotSearchTarget;
}

const FavouriteCardMap = (props: Props): JSX.Element => {
  const { latLonBounds, CRS } = initializeHelsinkiMap();
  const coord = getCentroid(props.target.plan_unit.geometry);

  if (!coord) {
    return <div>NO MAP AVAILABLE</div>;
  }

  return (
    <MapContainer
      className="favouritesPage__targetCard__map"
      center={coord}
      zoom={8}
      dragging={false}
      scrollWheelZoom={false}
      doubleClickZoom={false}
      maxBounds={latLonBounds}
      bounds={latLonBounds}
      crs={CRS}
      zoomControl={false}
      whenCreated={whenMapCreated}
    >
      <WMSTileLayer
        url={'https://kartta.hel.fi/ws/geoserver/avoindata/wms?'}
        layers={'avoindata:Karttasarja_harmaa'}
        format={'image/png'}
        transparent={true}
      />
      <Marker position={coord} icon={getMarkerIcon('❤', 3)} />
    </MapContainer>
  );
};

export default FavouriteCardMap;
