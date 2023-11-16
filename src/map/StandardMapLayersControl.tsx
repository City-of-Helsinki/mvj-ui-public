import { LayersControl, WMSTileLayer } from 'react-leaflet';

import { MapLayer, MapLayerProperties, MapLayers } from './types';

type Props = {
  enabledLayers: Array<MapLayer>;
};

export const StandardMapLayer = ({
  layerData,
}: {
  layerData: MapLayerProperties;
}): JSX.Element => (
  <WMSTileLayer
    url={layerData.url}
    layers={layerData.layers}
    format={layerData.format}
    transparent={true}
  />
);

export const StandardMapLayersControl = ({
  enabledLayers,
}: Props): JSX.Element => (
  <LayersControl position="bottomright">
    {enabledLayers.map((layer, i) => {
      const layerData = MapLayers[layer];

      return (
        <LayersControl.BaseLayer
          checked={i === 0}
          name={layerData.label}
          key={layerData.identifier}
        >
          <StandardMapLayer layerData={layerData} />
        </LayersControl.BaseLayer>
      );
    })}
  </LayersControl>
);
