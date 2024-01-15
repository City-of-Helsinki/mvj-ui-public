import AbstractProvider, {
  EndpointArgument,
  ParseArgument,
  SearchArgument,
  SearchResult,
} from 'leaflet-geosearch/lib/providers/provider.js';

import {
  HelsinkiGeocoderResponse,
  HelsinkiGeocoderResponseItem,
} from './types';

export default class HelsinkiProvider extends AbstractProvider<
  HelsinkiGeocoderResponse,
  HelsinkiGeocoderResponseItem
> {
  getParamString(params: Record<string, string | number | boolean>): string {
    return Object.keys(params)
      .map(
        (key) =>
          `${encodeURIComponent(key)}=${encodeURIComponent(params[key])}`,
      )
      .join('&');
  }

  async search({ query }: SearchArgument): Promise<Array<SearchResult>> {
    const url = this.endpoint({ query });

    const request = await fetch(url);
    const json = await request.json();

    return this.parse({ data: json });
  }

  endpoint({ query }: EndpointArgument = { query: '' }): string {
    const { params } = this.options;

    const paramString = this.getParamString({
      ...params,
      name: query as string,
    });

    return `https://dev.hel.fi/geocoder/v1/address/?${paramString}&municipality=91`;
  }

  parse({
    data: { objects },
  }: ParseArgument<HelsinkiGeocoderResponse>): Array<SearchResult> {
    return objects.map((r) => {
      return {
        x: r.location.coordinates[0],
        y: r.location.coordinates[1],
        label: r.name,
        bounds: null,
        raw: r,
      };
    });
  }
}
