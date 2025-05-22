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
    opacity={layerData.opacity || 1}
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
    <LayersControl.Overlay
      name={MapLayers[MapLayer.helsinkiOwnedAreas].label}
      checked={true}
    >
      <StandardMapLayer layerData={MapLayers[MapLayer.helsinkiOwnedAreas]} />
    </LayersControl.Overlay>
    <LayersControl.Overlay
      name={MapLayers[MapLayer.publicStreetAreas].label}
      checked={true}
    >
      <StandardMapLayer layerData={MapLayers[MapLayer.publicStreetAreas]} />
    </LayersControl.Overlay>
    <LayersControl.Overlay
      name={MapLayers[MapLayer.publicGreenAreas].label}
      checked={true}
    >
      <StandardMapLayer layerData={MapLayers[MapLayer.publicGreenAreas]} />
    </LayersControl.Overlay>
  </LayersControl>
);
