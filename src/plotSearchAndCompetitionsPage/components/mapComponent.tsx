import React from 'react';
import {
  MapContainer,
  WMSTileLayer,
  LayersControl,
  ZoomControl,
} from 'react-leaflet';
import * as L from 'leaflet';
import 'proj4leaflet';
import { LatLng } from 'leaflet';
import { useTranslation } from 'react-i18next';
import { PlotSearch } from '../../plotSearch/types';
import {
  CategoryOptions,
  CategoryVisibilities,
  SelectedTarget,
} from '../plotSearchAndCompetitionsPage';
import MapPlotSearchOverlay from './mapPlotSearchOverlay';
import { initializeHelsinkiMap } from '../utils';
import { Favourite } from '../../favourites/types';

interface Props {
  plotSearches: Array<PlotSearch>;
  setSelectedTarget: (target: SelectedTarget) => void;
  selectedTarget: SelectedTarget;
  categoryOptions: CategoryOptions;
  categoryVisibilities: CategoryVisibilities;
  favourite: Favourite;
}

export const whenMapCreated = (map: L.Map): void => {
  new ResizeObserver(() => {
    map.invalidateSize(false);
  }).observe(map.getContainer());
};

const MapComponent = (props: Props): JSX.Element => {
  // Initializing map settings

  const initialPosition = new LatLng(60.167642, 24.954753);
  const { BaseLayer } = LayersControl;
  const { latLonBounds, CRS } = initializeHelsinkiMap();

  // Initializing other component variables

  const { t } = useTranslation();
  const plotSearchesByCategory = props.categoryOptions.map((category) => ({
    category,
    plotSearches: props.plotSearches?.filter(
      (plotSearch) => plotSearch.type?.id === category.id
    ),
  }));

  return (
    <MapContainer
      className="MapComponent"
      center={initialPosition}
      zoom={6}
      scrollWheelZoom={true}
      maxBounds={latLonBounds}
      bounds={latLonBounds}
      minZoom={2}
      maxZoom={12}
      crs={CRS}
      zoomControl={false}
      whenCreated={whenMapCreated}
    >
      <LayersControl position="bottomright">
        <BaseLayer
          checked
          name={t(
            'plotSearchAndCompetitions.mapComponent.mapLayers.base',
            'Base map'
          )}
        >
          <WMSTileLayer
            url={'https://kartta.hel.fi/ws/geoserver/avoindata/wms?'}
            layers={'avoindata:Karttasarja_harmaa'}
            format={'image/png'}
            transparent={true}
          />
        </BaseLayer>
        <BaseLayer
          name={t(
            'plotSearchAndCompetitions.mapComponent.mapLayers.orto',
            'Ortographic'
          )}
        >
          <WMSTileLayer
            url={'https://kartta.hel.fi/ws/geoserver/avoindata/wms?'}
            layers={'avoindata:Ortoilmakuva'}
            format={'image/png'}
            transparent={true}
          />
        </BaseLayer>
        <BaseLayer
          name={t(
            'plotSearchAndCompetitions.mapComponent.mapLayers.plan',
            'City plan'
          )}
        >
          <WMSTileLayer
            url={'https://kartta.hel.fi/ws/geoserver/avoindata/wms?'}
            layers={'avoindata:Ajantasa_asemakaava'}
            format={'image/png'}
            transparent={true}
          />
        </BaseLayer>
      </LayersControl>
      <ZoomControl position={'topright'} />
      {plotSearchesByCategory.map(
        (item, index) =>
          props.categoryVisibilities[item.category.id] &&
          item.plotSearches.map((plotSearch) => {
            if (
              props.favourite.targets.length <= 0 ||
              plotSearch.id === props.favourite.targets[0].plot_search
            ) {
              return (
                <MapPlotSearchOverlay
                  plotSearchTargets={plotSearch.plot_search_targets}
                  key={plotSearch.id}
                  selectedTarget={props.selectedTarget}
                  plotSearch={plotSearch}
                  setSelectedTarget={props.setSelectedTarget}
                  categoryIndex={index}
                  categorySymbol={item.category.symbol}
                  initialPosition={initialPosition}
                  favouritedTargets={props.favourite.targets}
                />
              );
            }
          })
      )}
    </MapContainer>
  );
};

export default MapComponent;
