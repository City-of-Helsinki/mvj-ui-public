import { JsonProvider } from 'leaflet-geosearch';
import type {
  EndpointArgument,
  SearchArgument,
  SearchResult,
  ParseArgument,
  ProviderParams,
} from 'leaflet-geosearch/lib/providers/provider.js';

import type { ServiceMapResponse, ServiceMapAddress } from './types';

const SERVICE_MAP_URL = 'https://api.hel.fi/servicemap/v2';
export default class HelsinkiProvider extends JsonProvider<
  ServiceMapResponse,
  ServiceMapAddress
> {
  getParamString(params: ProviderParams): string {
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
    const json = (await request.json()) as ServiceMapResponse;

    return this.parse({ data: json });
  }

  endpoint({ query }: EndpointArgument = { query: '' }): string {
    const { params } = this.options;
    const paramString = this.getParamString({
      ...params,
      q: query as string,
    });

    return `${SERVICE_MAP_URL}/search/?${paramString}&type=address&municipality=helsinki`;
  }

  parse({ data }: ParseArgument<ServiceMapResponse>): Array<SearchResult> {
    return data.results?.map((address) => {
      return {
        x: address.location?.coordinates[0] ?? 0,
        y: address.location?.coordinates[1] ?? 0,
        label: address.name?.fi ?? '',
        bounds: null,
        raw: address,
      };
    });
  }
}
