import { Geometry } from 'geojson';
import { LatLng, LatLngExpression } from 'leaflet';

export const getCentroid = (geometry: Geometry): LatLngExpression => {
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
      // TODO: Fix to throw "geometry type not valid" exception
      return new LatLng(0, 0);
  }
};
