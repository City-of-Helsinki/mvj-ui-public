import React from 'react';
import { MapContainer, Marker, Tooltip } from 'react-leaflet';
import 'proj4leaflet';
import { IconHeartFill } from 'hds-react';
import L, { DivIcon } from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';

import { PlotSearchTarget } from '../../plotSearch/types';
import { attachMapResizeObserver, getTargetCentroid } from '../../map/utils';
import { initializeHelsinkiMap } from '../../map/utils';
import { AppRoutes, getRouteById } from '../../root/routes';
import { StandardMapLayer } from '../../map/StandardMapLayersControl';
import { MapLayer, MapLayers } from '../../map/types';

interface Props {
  target: PlotSearchTarget;
  noLink?: boolean;
}

const FavouriteCardMap = (props: Props): JSX.Element => {
  const { latLonBounds, CRS } = initializeHelsinkiMap();
  const coord = getTargetCentroid(props.target);
  const { t } = useTranslation();
  const navigate = useNavigate();

  const linkToTarget = !(props.noLink || false);

  const getIcon = (): DivIcon => {
    const html = renderToStaticMarkup(<IconHeartFill />);
    return new L.DivIcon({
      html: html,
      className: 'FavouriteCardMap__icon',
      iconAnchor: [15, 20],
    });
  };

  if (!coord) {
    // TODO: A better placeholder here...
    return (
      <div>{t('favouritesPage.map.notAvailable', 'Map not available')}</div>
    );
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
      whenCreated={attachMapResizeObserver}
    >
      <StandardMapLayer layerData={MapLayers[MapLayer.generalMap]} />
      <Marker
        position={coord}
        icon={getIcon()}
        eventHandlers={
          linkToTarget
            ? {
                click: () => {
                  navigate(
                    getRouteById(
                      AppRoutes.PLOT_SEARCH_AND_COMPETITIONS_TARGET
                    ) + props.target.id
                  );
                },
              }
            : {}
        }
      >
        {linkToTarget && (
          <Tooltip direction="bottom">
            {t('favouritesPage.map.showOnMap', 'Show on map')}
          </Tooltip>
        )}
      </Marker>
    </MapContainer>
  );
};

export default FavouriteCardMap;
