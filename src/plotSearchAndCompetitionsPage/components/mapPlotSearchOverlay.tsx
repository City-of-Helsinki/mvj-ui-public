import React, { Fragment, useEffect, useRef, useState } from 'react';
import { PlotSearch, PlotSearchTarget } from '../../plotSearch/types';
import { useMapEvents, GeoJSON, Marker, useMap } from 'react-leaflet';
import { DivIcon } from 'leaflet';
import L from 'leaflet';
import { renderToStaticMarkup } from 'react-dom/server';
import MapSymbol from './mapSymbol';
import { getCentroid } from '../utils';
import { SelectedTarget } from '../plotSearchAndCompetitionsPage';

interface Props {
  plotSearchTargets: PlotSearchTarget[];
  selectedTarget: SelectedTarget;
  setSelectedTarget: (target: SelectedTarget) => void;
  plotSearch: PlotSearch;
  categoryIndex: number;
  categorySymbol: string;
}

const usePreviousTarget = (value: SelectedTarget) => {
  const ref = useRef<SelectedTarget>();
  useEffect(() => {
    ref.current = value;
  });
  return ref.current;
};

const MapPlotSearchOverlay = (props: Props): JSX.Element => {
  const map = useMap();
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
  });

  const getMarkerIcon = (): DivIcon => {
    const html = renderToStaticMarkup(
      <MapSymbol
        symbol={props.categorySymbol}
        colorIndex={props.categoryIndex}
      />
    );
    return new L.DivIcon({ html: html, className: 'MapSymbol' });
  };

  const handleMarkerClick = (target: PlotSearchTarget): void => {
    props.setSelectedTarget({
      target: target,
      plotSearch: props.plotSearch,
    });
  };

  const renderMarker = (target: PlotSearchTarget): JSX.Element | null => {
    const position = getCentroid(target.plan_unit.geometry);
    if (position) {
      return (
        <Marker
          position={position}
          icon={getMarkerIcon()}
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
          {renderMarker(target)}
        </Fragment>
      ))}
    </Fragment>
  );
};

export default MapPlotSearchOverlay;
