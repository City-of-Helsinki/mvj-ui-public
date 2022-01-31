import React, { Fragment, useEffect, useRef, useState } from 'react';
import { PlotSearch, PlotSearchTarget } from '../../plotSearch/types';
import { useMapEvents, GeoJSON, Marker, useMap } from 'react-leaflet';
import L, { DivIcon, LatLngExpression } from 'leaflet';
import { getCentroid } from '../utils';
import { SelectedTarget } from '../plotSearchAndCompetitionsPage';
import { renderToStaticMarkup } from 'react-dom/server';
import MapSymbol from './mapSymbol';
import { FavouriteTarget } from '../../favourites/types';
import { useNavigate } from 'react-router';
import { AppRoutes, getRouteById } from '../../root/routes';

interface Props {
  plotSearchTargets: PlotSearchTarget[];
  selectedTarget: SelectedTarget;
  setSelectedTarget: (target: SelectedTarget) => void;
  plotSearch: PlotSearch;
  categoryIndex: number;
  categorySymbol: string;
  initialPosition: LatLngExpression;
  favouritedTargets: FavouriteTarget[];
}

const usePreviousTarget = (value: SelectedTarget) => {
  const ref = useRef<SelectedTarget>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

export const getMarkerIcon = (
  symbol: string,
  index: number,
  isFavourite: boolean
): DivIcon => {
  const html = renderToStaticMarkup(
    <div>
      <MapSymbol symbol={symbol} colorIndex={index} isFavourite={isFavourite} />
    </div>
  );
  return new L.DivIcon({
    html: html,
    className: 'MapSymbol',
    iconAnchor: [15, 0],
  });
};

const MapPlotSearchOverlay = (props: Props): JSX.Element => {
  const map = useMap();
  const navigate = useNavigate();
  const [zoomLevel, setZoomLevel] = useState(map.getZoom());

  const prevSelectedTarget = usePreviousTarget(props.selectedTarget);

  const mapEvents = useMapEvents({
    zoomend: () => {
      setZoomLevel(mapEvents.getZoom());
    },
  });

  useEffect(() => {
    if (props.selectedTarget && props.selectedTarget != prevSelectedTarget) {
      const position = getCentroid(
        props.selectedTarget.target.plan_unit.geometry
      );
      if (position) {
        map.setView(position, 9);
      }
    }

    // if target is going to null, set map to initialPosition
    if (prevSelectedTarget !== null && props.selectedTarget === null) {
      map.setView(props.initialPosition, 6);
    }
  });

  const handleMarkerClick = (target: PlotSearchTarget): void => {
    navigate(
      getRouteById(AppRoutes.PLOT_SEARCH_AND_COMPETITIONS_TARGET) + target.id
    );
  };

  const renderMarker = (
    target: PlotSearchTarget,
    favouritedTargets: PlotSearchTarget[]
  ): JSX.Element | null => {
    const isFavourited = favouritedTargets.some((t) => t.id === target.id);
    const position = getCentroid(target.plan_unit.geometry);
    if (position) {
      return (
        <Marker
          position={position}
          icon={getMarkerIcon(
            props.categorySymbol,
            props.categoryIndex,
            isFavourited
          )}
          eventHandlers={{
            click: () => handleMarkerClick(target),
          }}
        />
      );
    }
    return null;
  };

  return (
    <Fragment>
      {props.plotSearchTargets.map((target) => (
        <Fragment key={target.id}>
          {zoomLevel > 7 && (
            <GeoJSON
              style={{ weight: 0 }}
              data={target.plan_unit.geometry}
              eventHandlers={{
                click: () => handleMarkerClick(target),
              }}
            />
          )}
          {renderMarker(
            target,
            props.favouritedTargets.map((t) => t.plot_search_target)
          )}
        </Fragment>
      ))}
    </Fragment>
  );
};

export default MapPlotSearchOverlay;
