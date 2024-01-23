import { useRef } from 'react';
import { FeatureGroup, MapContainer, useMapEvents } from 'react-leaflet';
import { FeatureGroup as FeatureGroupType } from 'leaflet';
import { blur, focus, WrappedFieldProps } from 'redux-form';
import { Feature } from 'geojson';
import { connect } from 'react-redux';

import { StandardMapLayersControl } from '../../map/StandardMapLayersControl';
import {
  attachMapResizeObserver,
  convertGeoJSONArrayForLeaflet,
  convertPolygonArrayToMultiPolygon,
  drawnShapeLayerPredicate,
  HELSINKI_CENTRAL_COORDINATES,
  initializeHelsinkiMap,
} from '../../map/utils';
import { MapLayer } from '../../map/types';
import ZoomControl from '../../map/ZoomControl';
import DrawTools from '../../map/DrawTools';
import GeoSearch from '../../map/GeoSearch';
import MapReadyHandler from '../../map/MapReadyHandler';
import ApplicationFieldError from '../../application/components/ApplicationFieldError';

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
  const { latLonBounds, CRS } = initializeHelsinkiMap();

  const featureGroupRef = useRef<FeatureGroupType>(null);

  const getSelectionAreaCenter = () => {
    const { coordinates } = value;
    if (!coordinates) return HELSINKI_CENTRAL_COORDINATES;

    // all coordinate points to a single array
    const latLngCoord = convertGeoJSONArrayForLeaflet(coordinates).flat(2);

    if (!latLngCoord.length) return HELSINKI_CENTRAL_COORDINATES;

    const center = latLngCoord
      .reduce((previous: Array<any>, current: Array<any>) => {
        return [previous[0] + current[0], previous[1] + current[1]];
      })
      .map((item: number) => item / latLngCoord.length);

    return center;
  };

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
    useMapEvents({
      focus: () => focus(form, name),
      blur: () => blur(form, name, value, true),
    });

    return null;
  };

  return (
    <div className="AreaSearchMap">
      <MapContainer
        className="AreaSearchMap__map"
        center={getSelectionAreaCenter()}
        zoom={6}
        scrollWheelZoom={true}
        maxBounds={latLonBounds}
        bounds={latLonBounds}
        minZoom={2}
        maxZoom={12}
        crs={CRS}
        zoomControl={false}
      >
        <MapReadyHandler whenCreated={attachMapResizeObserver} />
        <ZoomControl />
        <EventHandler />
        <StandardMapLayersControl
          enabledLayers={[
            MapLayer.generalMap,
            //MapLayer.helsinkiOwnedAreas
          ]}
        />
        <GeoSearch />
        <FeatureGroup ref={featureGroupRef}>
          <DrawTools
            onChange={updateFieldValue}
            featureGroup={featureGroupRef}
            value={value}
          />
        </FeatureGroup>
      </MapContainer>
      {touched && !valid && (
        <ApplicationFieldError className="AreaSearchMap__error" error={error} />
      )}
    </div>
  );
};

export default connect(null, {
  focus,
  blur,
})(AreaSearchMap);
