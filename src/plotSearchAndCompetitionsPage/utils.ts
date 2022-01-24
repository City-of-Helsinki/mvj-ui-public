import { Geometry } from 'geojson';
import { CRS, LatLng, LatLngBounds, LatLngExpression } from 'leaflet';
import * as L from 'leaflet';
import proj4 from 'proj4';

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

interface HelsinkiMapData {
  latLonBounds: LatLngBounds;
  CRS: CRS;
}

export const initializeHelsinkiMap = (): HelsinkiMapData => {
  const southWest = new LatLng(60.079029, 24.646353);
  const northEast = new LatLng(60.318135, 26.196695);
  const latLonBounds = new L.LatLngBounds(southWest, northEast);
  const bounds = L.bounds([25440000, 6630000], [26571072, 6761072]);
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

  return { latLonBounds, CRS };
};
