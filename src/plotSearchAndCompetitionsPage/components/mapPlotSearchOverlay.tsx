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
      map.setView(
        getCentroid(props.selectedTarget.target.plan_unit.geometry),
        9
      );
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

  return (
    <Fragment>
      {props.plotSearchTargets.map((target) => (
        <Fragment key={target.id}>
          {zoomLevel > 7 && (
            <GeoJSON
              data={target.plan_unit.geometry}
              eventHandlers={{
                click: () => {
                  props.setSelectedTarget({
                    target: target,
                    plotSearch: props.plotSearch,
                  });
                },
              }}
            />
          )}
          <Marker
            position={getCentroid(target.plan_unit.geometry)}
            icon={getMarkerIcon()}
            eventHandlers={{
              click: () => {
                props.setSelectedTarget({
                  target: target,
                  plotSearch: props.plotSearch,
                });
              },
            }}
          />
        </Fragment>
      ))}
    </Fragment>
  );
};

export default MapPlotSearchOverlay;
