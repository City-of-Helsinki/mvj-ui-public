import React from 'react';
import {
  MapContainer,
  WMSTileLayer,
  LayersControl,
  ZoomControl,
} from 'react-leaflet';
import * as L from 'leaflet';
import proj4 from 'proj4';
import 'proj4leaflet';
import { LatLng } from 'leaflet';
import { PlotSearch } from '../../plotSearch/types';
import {
  CategoryOptions,
  CategoryVisibilities,
  SelectedTarget,
} from '../plotSearchAndCompetitionsPage';
import MapPlotSearchOverlay from './mapPlotSearchOverlay';

interface Props {
  plotSearches: Array<PlotSearch>;
  setSelectedTarget: (target: SelectedTarget) => void;
  selectedTarget: SelectedTarget;
  categoryOptions: CategoryOptions;
  categoryVisibilities: CategoryVisibilities;
}

const MapComponent = (props: Props): JSX.Element => {
  // Initializing map settings

  const initialPosition = new LatLng(60.167642, 24.954753);
  const { BaseLayer } = LayersControl;
  const southWest = new LatLng(60.079029, 24.646353);
  const northEast = new LatLng(60.318135, 25.196695);
  const latLonBounds = new L.LatLngBounds(southWest, northEast);
  const bounds = L.bounds([25440000, 6630000], [25571072, 6761072]);
  const CRS = new L.Proj.CRS(
    'EPSG:3879',
    '+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    {
      resolutions: [
        256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125, 0.0625, 0.03125,
      ],
      bounds,
    }
  );

  proj4.defs(
    'EPSG:3879',
    '+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs'
  );
  proj4.defs(
    'WGS84',
    '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees'
  );

  const plotSearchesByCategory = props.categoryOptions.map((category) => ({
    category,
    plotSearches: props.plotSearches?.filter(
      (plotSearch) => plotSearch.type?.id === category.id
    ),
  }));

  return (
    <MapContainer
      className={'mapComponent'}
      center={initialPosition}
      zoom={6}
      scrollWheelZoom={true}
      maxBounds={latLonBounds}
      bounds={latLonBounds}
      crs={CRS}
      zoomControl={false}
    >
      <LayersControl position="bottomright">
        <BaseLayer checked name="Karttasarja">
          <WMSTileLayer
            url={'https://kartta.hel.fi/ws/geoserver/avoindata/wms?'}
            layers={'avoindata:Karttasarja_harmaa'}
            format={'image/png'}
            transparent={true}
          />
        </BaseLayer>
        <BaseLayer name="Ortoilmakuva">
          <WMSTileLayer
            url={'https://kartta.hel.fi/ws/geoserver/avoindata/wms?'}
            layers={'avoindata:Ortoilmakuva'}
            format={'image/png'}
            transparent={true}
          />
        </BaseLayer>
        <BaseLayer name="Asemakaava">
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
          item.plotSearches.map((plotSearch) => (
            <MapPlotSearchOverlay
              plotSearchTargets={plotSearch.plot_search_targets}
              key={plotSearch.id}
              selectedTarget={props.selectedTarget}
              plotSearch={plotSearch}
              setSelectedTarget={props.setSelectedTarget}
              categoryIndex={index}
              categorySymbol={item.category.symbol}
            />
          ))
      )}
    </MapContainer>
  );
};

export default MapComponent;
