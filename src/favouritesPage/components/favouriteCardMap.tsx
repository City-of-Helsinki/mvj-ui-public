import React from 'react';
import { MapContainer, WMSTileLayer, Marker, Tooltip } from 'react-leaflet';
import 'proj4leaflet';
import { IconHeartFill } from 'hds-react';
import { PlotSearchTarget } from '../../plotSearch/types';
import { getCentroid } from '../../plotSearchAndCompetitionsPage/utils';
import { initializeHelsinkiMap } from '../../plotSearchAndCompetitionsPage/utils';
import { whenMapCreated } from '../../plotSearchAndCompetitionsPage/components/mapComponent';
import L, { DivIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { AppRoutes, getRouteById } from '../../root/routes';

interface Props {
  target: PlotSearchTarget;
}

const FavouriteCardMap = (props: Props): JSX.Element => {
  const { latLonBounds, CRS } = initializeHelsinkiMap();
  const coord = getCentroid(props.target.plan_unit.geometry);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const getIcon = (): DivIcon => {
    const html = renderToStaticMarkup(<IconHeartFill />);
    return new L.DivIcon({
      html: html,
      className: 'FavouriteCardMap__icon',
      iconAnchor: [15, 20],
    });
  };

  if (!coord) {
    // TODO: Some reasonable placeholder here..
    return <div>NO MAP AVAILABLE</div>;
  }

  return (
    <MapContainer
      className="FavouriteCardMap"
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
      <Marker
        position={coord}
        icon={getIcon()}
        eventHandlers={{
          click: () => {
            navigate(
              getRouteById(AppRoutes.PLOT_SEARCH_AND_COMPETITIONS_TARGET) +
                props.target.id
            );
          },
        }}
      >
        <Tooltip direction="bottom">
          {t('favouritesPage.map.showOnMap', 'Show on map')}
        </Tooltip>
      </Marker>
    </MapContainer>
  );
};

export default FavouriteCardMap;
