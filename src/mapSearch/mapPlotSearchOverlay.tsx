import React, { Fragment, useEffect, useRef, useState } from 'react';
import { PlotSearch, PlotSearchTarget } from '../plotSearch/types';
import { useMapEvents, GeoJSON, Marker, useMap } from 'react-leaflet';
import L, { DivIcon, LatLngExpression } from 'leaflet';
import { getTargetCentroid } from '../map/utils';
import { SelectedTarget } from './mapSearchPage';
import { renderToStaticMarkup } from 'react-dom/server';
import MapSymbol from './mapSymbol';
import { FavouriteTarget } from '../favourites/types';
import { useNavigate } from 'react-router';
import { AppRoutes, getRouteById } from '../root/routes';

interface Props {
  plotSearchTargets: PlotSearchTarget[];
  selectedTarget: SelectedTarget;
  setSelectedTarget: (target: SelectedTarget) => void;
  plotSearch: PlotSearch;
  categoryIndex: number;
  categorySymbol: string;
  initialPosition: LatLngExpression;
  favouritedTargets: FavouriteTarget[];
  hoveredTargetId: number | null;
  setHoveredTargetId: (id: number | null) => void;
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
  isFavourite: boolean,
  isHover: boolean
): DivIcon => {
  const html = renderToStaticMarkup(
    <MapSymbol
      symbol={symbol}
      colorIndex={index}
      isFavourite={isFavourite}
      isHover={isHover}
    />
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
      const position = getTargetCentroid(props.selectedTarget.target);
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
    const isHover = props.hoveredTargetId === target.id && zoomLevel <= 7;

    const position = getTargetCentroid(target);
    if (position) {
      return (
        <Marker
          position={position}
          icon={getMarkerIcon(
            props.categorySymbol,
            props.categoryIndex,
            isFavourited,
            isHover
          )}
          eventHandlers={{
            mouseover: () => props.setHoveredTargetId(target.id),
            mouseout: () => props.setHoveredTargetId(null),
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
              style={{ weight: props.hoveredTargetId === target.id ? 3 : 0 }}
              data={target.plan_unit.geometry}
              eventHandlers={{
                mouseover: () => props.setHoveredTargetId(target.id),
                mouseout: () => props.setHoveredTargetId(null),
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
