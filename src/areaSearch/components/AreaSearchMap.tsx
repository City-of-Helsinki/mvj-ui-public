import React, { useRef } from 'react';
import { FeatureGroup, MapContainer, useMapEvents } from 'react-leaflet';
import {
  FeatureGroup as FeatureGroupType,
  LeafletEventHandlerFnMap,
} from 'leaflet';
import { blur, focus, WrappedFieldProps } from 'redux-form';
import { Feature } from 'geojson';
import { connect } from 'react-redux';
import { IconAlertCircleFill } from 'hds-react';

import { StandardMapLayersControl } from '../../map/StandardMapLayersControl';
import {
  attachMapResizeObserver,
  convertPolygonArrayToMultiPolygon,
  drawnShapeLayerPredicate,
  HELSINKI_CENTRAL_COORDINATES,
  initializeHelsinkiMap,
} from '../../map/utils';
import { MapLayer } from '../../map/types';
import ZoomControl from '../../map/ZoomControl';
import DrawTools from '../../map/DrawTools';
import GeoSearch from '../../map/GeoSearch';

type Props = {
  focus: typeof focus;
  blur: typeof blur;
};

const AreaSearchMap = ({
  input: { onChange, name, value },
  meta: { valid, error, form, touched },
  blur,
  focus,
}: WrappedFieldProps & Props) => {
  const initialPosition = HELSINKI_CENTRAL_COORDINATES;
  const { latLonBounds, CRS } = initializeHelsinkiMap();

  const featureGroupRef = useRef<FeatureGroupType>(null);

  const updateFieldValue = (): void => {
    const group = featureGroupRef.current;

    if (group) {
      const data: Array<Feature> = [];
      group.eachLayer((layer) => {
        if (drawnShapeLayerPredicate(layer)) {
          // Drawn shapes should be single Features, not FeatureCollections or GeometryCollections.
          const layerData = layer.toGeoJSON() as Feature;

          data.push(layerData);
        }
      });

      onChange(convertPolygonArrayToMultiPolygon(data));
    }
  };

  const EventHandler = () => {
    // LeafletEventHandlerFnMap has a generic key-value pair field at the end of its definition,
    // accompanied with a note that that allows custom events but makes the interface uncheckable.
    // However, it has been commented out, i.e. not enabled. We manually cast to that function map
    // to pass these unmentioned events that Leaflet does support and we need.
    useMapEvents({
      focus: () => focus(form, name),
      blur: () => blur(form, name, value, true),
    } as LeafletEventHandlerFnMap);

    return null;
  };

  return (
    <div className="AreaSearchMap">
      <MapContainer
        className="AreaSearchMap__map"
        center={initialPosition}
        zoom={6}
        scrollWheelZoom={true}
        maxBounds={latLonBounds}
        bounds={latLonBounds}
        minZoom={2}
        maxZoom={12}
        crs={CRS}
        zoomControl={false}
        whenCreated={attachMapResizeObserver}
      >
        <ZoomControl />
        <EventHandler />
        <StandardMapLayersControl
          enabledLayers={[
            MapLayer.baseMap,
            //MapLayer.helsinkiOwnedAreas
          ]}
        />
        <GeoSearch />
        <FeatureGroup ref={featureGroupRef}>
          <DrawTools
            onChange={updateFieldValue}
            featureGroup={featureGroupRef}
          />
        </FeatureGroup>
      </MapContainer>
      {touched && !valid && (
        <div className="AreaSearchMap__error" role="alert">
          <IconAlertCircleFill />
          <span>{error}</span>
        </div>
      )}
    </div>
  );
};

export default connect(null, {
  focus,
  blur,
})(AreaSearchMap);
