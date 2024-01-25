import type {
  Feature,
  Geometry,
  MultiPolygon,
  Polygon,
  Position,
} from 'geojson';
import {
  CircleMarker,
  CRS,
  LatLng,
  LatLngBounds,
  LatLngExpression,
  Layer,
  LayerGroup,
  Marker,
  Polyline,
} from 'leaflet';
import type { LatLngTuple } from 'leaflet';
import * as L from 'leaflet';
import 'leaflet-draw';
import 'proj4leaflet';
import proj4 from 'proj4';
import i18n from 'i18next';
import { PlotSearchTarget } from '../plotSearch/types';

export const getCentroid = (geometry: Geometry): LatLngExpression | null => {
  const sum = [0, 0];
  let count = 0;

  switch (geometry.type) {
    case 'MultiPolygon':
      for (let i = 0; i < geometry.coordinates.length; i++) {
        for (let j = 0; j < geometry.coordinates[i].length; j++) {
          for (let k = 0; k < geometry.coordinates[i][j].length; k++) {
            sum[0] += geometry.coordinates[i][j][k][0];
            sum[1] += geometry.coordinates[i][j][k][1];
            count++;
          }
        }
      }
      return new LatLng(sum[1] / count, sum[0] / count);

    case 'Polygon':
      for (let i = 0; i < geometry.coordinates[i].length; i++) {
        for (let j = 0; j < geometry.coordinates[i][j].length; j++) {
          sum[0] += geometry.coordinates[i][j][0];
          sum[1] += geometry.coordinates[i][j][1];
          count++;
        }
      }
      return new LatLng(sum[1] / count, sum[0] / count);

    default:
      return null;
  }
};

export const getTargetCentroid = (
  target: PlotSearchTarget,
): LatLngExpression | null => {
  if (target.target_plan?.geometry) {
    return getCentroid(target.target_plan.geometry);
  }

  return null;
};

interface HelsinkiMapData {
  latLonBounds: LatLngBounds;
  CRS: CRS;
}

const getCRS = (bounds: L.Bounds): L.Proj.CRS => {
  // Resolutions at which tiles are available: how many units each pixel on the map represents.
  // In this case how many meters each pixel represents.
  const resolutions: L.Proj.ProjCRSOptions['resolutions'] = [
    256, 128, 64, 32, 16, 8, 4, 2, 1, 0.5, 0.25, 0.125, 0.0625, 0.03125,
    0.015625, 0.0078125, 0.00390625, 0.001953125,
  ];
  const coordinateReferenceSystem = new L.Proj.CRS(
    'EPSG:3879',
    '+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
    {
      resolutions,
      bounds,
    },
  );
  return coordinateReferenceSystem;
};

export const initializeHelsinkiMap = (): HelsinkiMapData => {
  const southWest = new LatLng(60.079029, 24.646353);
  const northEast = new LatLng(60.318135, 26.196695);
  const latLonBounds = new L.LatLngBounds(southWest, northEast);
  const bounds = L.bounds([25440000, 6630000], [26571072, 6761072]);
  const CRS = getCRS(bounds);

  proj4.defs(
    'EPSG:3879',
    '+proj=tmerc +lat_0=0 +lon_0=25 +k=1 +x_0=25500000 +y_0=0 +ellps=GRS80 +towgs84=0,0,0,0,0,0,0 +units=m +no_defs',
  );
  proj4.defs(
    'WGS84',
    '+title=WGS 84 (long/lat) +proj=longlat +ellps=WGS84 +datum=WGS84 +units=degrees',
  );

  return { latLonBounds, CRS };
};

export const drawnShapeLayerPredicate = (
  layer: Layer,
): layer is LayerGroup | Polyline | CircleMarker | Marker =>
  (layer as LayerGroup | Polyline | CircleMarker | Marker).toGeoJSON !==
  undefined;

export const polygonFeaturePredicate = (
  feature: Feature,
): feature is Feature<Polygon> => feature.geometry !== undefined;

export const convertPolygonArrayToMultiPolygon = (
  polygons: Array<Feature>,
): MultiPolygon => {
  // Both freeform shapes and rectangles drawn on the map should be polygon-type features.
  // If other types are passed in, they are ignored.
  return {
    coordinates: polygons.filter(polygonFeaturePredicate).map((polygon) => {
      return polygon.geometry.coordinates;
    }),
    type: 'MultiPolygon',
  };
};

type RecursivePosition = Position | RecursivePosition[];

export const convertGeoJSONArrayForLeaflet = (
  coordinates: Position[][],
): LatLngTuple[][] => {
  const reverseLngLat = ([
    longitude,
    latitude,
    altitude,
  ]: Position): LatLngTuple => [latitude, longitude, altitude];

  const transformCoordinates = (
    items: RecursivePosition,
  ): LatLngTuple | LatLngTuple[] => {
    if (!items.length) return [];
    if (typeof items[0] === 'number') {
      return reverseLngLat(items as Position);
    } else {
      return (items as RecursivePosition[]).map(
        transformCoordinates,
      ) as LatLngTuple[];
    }
  };
  return coordinates.map(transformCoordinates) as LatLngTuple[][];
};

export const attachMapResizeObserver = (map: L.Map): void => {
  const resizeObserver = new ResizeObserver(() => {
    const panes = map.getPanes();
    if ('mapPane' in panes) {
      map.invalidateSize(false);
    }
  });
  resizeObserver.observe(map.getContainer());
};

export const setDrawToolLocalizations = (): void => {
  L.drawLocal.draw.handlers.circle.tooltip.start = i18n.t(
    'map.drawTools.draw.handlers.circle.tooltip.start',
    'Click and drag to draw a circle.',
  );
  L.drawLocal.draw.handlers.circle.radius = i18n.t(
    'map.drawTools.draw.handlers.circle.radius',
    'Radius',
  );
  L.drawLocal.draw.handlers.polygon.tooltip.start = i18n.t(
    'map.drawTools.draw.handlers.polygon.tooltip.start',
    'Click to start drawing a shape.',
  );
  L.drawLocal.draw.handlers.polygon.tooltip.cont = i18n.t(
    'map.drawTools.draw.handlers.polygon.tooltip.cont',
    'Click to continue drawing a shape.',
  );
  L.drawLocal.draw.handlers.polygon.tooltip.end = i18n.t(
    'map.drawTools.draw.handlers.polygon.tooltip.end',
    'Click the first point to close this shape.',
  );
  L.drawLocal.draw.handlers.polyline.error = i18n.t(
    'map.drawTools.draw.handlers.polyline.error',
    '<strong>Error:</strong> shape edges cannot cross!',
  );
  L.drawLocal.draw.handlers.polyline.tooltip.start = i18n.t(
    'map.drawTools.draw.handlers.polyline.tooltip.start',
    'Click to start drawing a line.',
  );
  L.drawLocal.draw.handlers.polyline.tooltip.cont = i18n.t(
    'map.drawTools.draw.handlers.polyline.tooltip.cont',
    'Click to continue drawing a line.',
  );
  L.drawLocal.draw.handlers.polyline.tooltip.end = i18n.t(
    'map.drawTools.draw.handlers.polyline.tooltip.end',
    'Click the last point to finish the line.',
  );
  L.drawLocal.draw.handlers.rectangle.tooltip.start = i18n.t(
    'map.drawTools.draw.handlers.rectangle.tooltip.start',
    'Click and drag to draw a rectangle.',
  );
  L.drawLocal.draw.handlers.simpleshape.tooltip.end = i18n.t(
    'map.drawTools.draw.handlers.simpleshape.tooltip.end',
    'Release the mouse button to finish drawing.',
  );

  L.drawLocal.edit.handlers.edit.tooltip.text = i18n.t(
    'map.drawTools.edit.handlers.edit.tooltip.text',
    'Drag handles or markers to edit features.',
  );
  L.drawLocal.edit.handlers.edit.tooltip.subtext = i18n.t(
    'map.drawTools.edit.handlers.edit.tooltip.subtext',
    'Click cancel to undo changes.',
  );
  L.drawLocal.edit.handlers.remove.tooltip.text = i18n.t(
    'map.drawTools.edit.handlers.remove.tooltip.text',
    'Click on a feature to remove.',
  );

  L.drawLocal.draw.toolbar.actions.title = i18n.t(
    'map.drawTools.draw.toolbar.actions.title',
    'Cancel drawing',
  );
  L.drawLocal.draw.toolbar.actions.text = i18n.t(
    'map.drawTools.draw.toolbar.actions.text',
    'Cancel',
  );
  L.drawLocal.draw.toolbar.finish.title = i18n.t(
    'map.drawTools.draw.toolbar.finish.title',
    'Finish drawing',
  );
  L.drawLocal.draw.toolbar.finish.text = i18n.t(
    'map.drawTools.draw.toolbar.finish.text',
    'Finish',
  );
  L.drawLocal.draw.toolbar.undo.title = i18n.t(
    'map.drawTools.draw.toolbar.undo.title',
    'Delete the last point drawn',
  );
  L.drawLocal.draw.toolbar.undo.text = i18n.t(
    'map.drawTools.draw.toolbar.undo.text',
    'Delete last point',
  );

  L.drawLocal.edit.toolbar.actions.save.title = i18n.t(
    'map.drawTools.edit.toolbar.actions.save.title',
    'Save changes',
  );
  L.drawLocal.edit.toolbar.actions.save.text = i18n.t(
    'map.drawTools.edit.toolbar.actions.save.text',
    'Save',
  );
  L.drawLocal.edit.toolbar.actions.cancel.title = i18n.t(
    'map.drawTools.edit.toolbar.actions.cancel.title',
    'Cancel editing, discards all changes',
  );
  L.drawLocal.edit.toolbar.actions.cancel.text = i18n.t(
    'map.drawTools.edit.toolbar.actions.cancel.text',
    'Cancel',
  );
  L.drawLocal.edit.toolbar.actions.clearAll.title = i18n.t(
    'map.drawTools.edit.toolbar.actions.clearAll.title',
    'Clear all layers',
  );
  L.drawLocal.edit.toolbar.actions.clearAll.text = i18n.t(
    'map.drawTools.edit.toolbar.actions.clearAll.text',
    'Clear All',
  );

  L.drawLocal.draw.toolbar.buttons.polyline = i18n.t(
    'map.drawTools.draw.toolbar.buttons.polyline',
    'Draw a polyline',
  );
  L.drawLocal.draw.toolbar.buttons.polygon = i18n.t(
    'map.drawTools.draw.toolbar.buttons.polygon',
    'Draw a polygon',
  );
  L.drawLocal.draw.toolbar.buttons.rectangle = i18n.t(
    'map.drawTools.draw.toolbar.buttons.rectangle',
    'Draw a rectangle',
  );
  L.drawLocal.draw.toolbar.buttons.circle = i18n.t(
    'map.drawTools.draw.toolbar.buttons.circle',
    'Draw a circle',
  );
  L.drawLocal.edit.toolbar.buttons.edit = i18n.t(
    'map.drawTools.edit.toolbar.buttons.edit',
    'Edit layers',
  );
  L.drawLocal.edit.toolbar.buttons.editDisabled = i18n.t(
    'map.drawTools.edit.toolbar.buttons.editDisabled',
    'No layers to edit',
  );
  L.drawLocal.edit.toolbar.buttons.remove = i18n.t(
    'map.drawTools.edit.toolbar.buttons.remove',
    'Delete layers',
  );
  L.drawLocal.edit.toolbar.buttons.removeDisabled = i18n.t(
    'map.drawTools.edit.toolbar.buttons.removeDisabled',
    'No layers to delete',
  );
};

export const HELSINKI_CENTRAL_COORDINATES = new LatLng(60.167642, 24.954753);

export const getAreaString = (geometry: Geometry): string => {
  return L.GeometryUtil.readableArea(getGeometryArea(geometry), true);
};

export const getGeometryArea = (geometry: Geometry): number => {
  let area = 0;

  switch (geometry.type) {
    case 'GeometryCollection':
      geometry.geometries.forEach((geometry) => {
        area += getGeometryArea(geometry);
      });
      break;
    case 'MultiPolygon':
      L.GeoJSON.coordsToLatLngs(geometry.coordinates, 2).forEach((latLngs) => {
        latLngs.forEach((latLng: Array<LatLng>) => {
          const polygonArea = L.GeometryUtil.geodesicArea(latLng);
          area += polygonArea;
        });
      });
      break;
    case 'Polygon':
      L.GeoJSON.coordsToLatLngs(geometry.coordinates, 1).forEach((latLng) => {
        area = L.GeometryUtil.geodesicArea(latLng);
      });
      break;
    default:
      break;
  }
  return area;
};
