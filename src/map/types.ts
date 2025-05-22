import i18n from '../i18n';
import createUrl from '../api/createUrl';

export enum MapLayer {
  generalMap = 'generalMap',
  orthographic = 'orthographic',
  cityPlan = 'cityPlan',
  baseMap = 'baseMap',
  helsinkiOwnedAreas = 'helsinkiOwnedAreas',
  publicStreetAreas = 'publicStreetAreas',
  publicGreenAreas = 'publicGreenAreas',
}

export type MapLayerProperties = {
  identifier: string;
  url: string;
  format: string;
  layers: string;
  label: string;
  opacity?: number;
};

export const MapLayers: Record<MapLayer, MapLayerProperties> = {
  [MapLayer.generalMap]: {
    identifier: MapLayer.generalMap,
    url: 'https://kartta.hel.fi/ws/geoserver/avoindata/wms?',
    layers: 'avoindata:Karttasarja_harmaa',
    format: 'image/png',
    label: i18n.t('map.mapLayers.generalMap', 'Base map'),
  },
  [MapLayer.orthographic]: {
    identifier: MapLayer.orthographic,
    url: 'https://kartta.hel.fi/ws/geoserver/avoindata/wms?',
    layers: 'avoindata:Ortoilmakuva',
    format: 'image/png',
    label: i18n.t('map.mapLayers.ortographic', 'Ortographic'),
  },
  [MapLayer.cityPlan]: {
    identifier: MapLayer.cityPlan,
    url: 'https://kartta.hel.fi/ws/geoserver/avoindata/wms?',
    layers: 'avoindata:Ajantasa_asemakaava',
    format: 'image/png',
    label: i18n.t('map.mapLayers.cityPlan', 'City plan'),
  },
  [MapLayer.baseMap]: {
    identifier: MapLayer.baseMap,
    url: 'https://kartta.hel.fi/ws/geoserver/avoindata/wms?',
    layers: 'avoindata:Kantakartta',
    format: 'image/png',
    label: i18n.t('map.mapLayers.baseMap', 'Base map'),
  },
  [MapLayer.helsinkiOwnedAreas]: {
    identifier: MapLayer.helsinkiOwnedAreas,
    url: createUrl('proxy/wms/helsinki_owned_areas/'),
    layers: 'Maanomistus_vuokrausalueet',
    format: 'image/png',
    label: i18n.t(
      'map.mapLayers.helsinkiOwnedAreas',
      'Areas owned by the City of Helsinki',
    ),
    opacity: 0.5,
  },
  [MapLayer.publicStreetAreas]: {
    identifier: MapLayer.publicStreetAreas,
    url: 'https://kartta.hel.fi/ws/geoserver/avoindata/wms?',
    layers: 'avoindata:YLRE_Katuosat_alue',
    format: 'image/png',
    label: i18n.t('map.mapLayers.publicStreetAreas', 'Street areas'),
    opacity: 0.5,
  },
  [MapLayer.publicGreenAreas]: {
    identifier: MapLayer.publicGreenAreas,
    url: 'https://kartta.hel.fi/ws/geoserver/avoindata/wms?',
    layers: 'avoindata:YLRE_Viherosat_alue',
    format: 'image/png',
    label: i18n.t('map.mapLayers.publicGreenAreas', 'Green areas'),
    opacity: 0.5,
  },
};

export interface ServiceMapAddress {
  object_type: 'address';
  name: {
    fi: string;
    sv: string;
    en: string;
  };
  number: string;
  number_end: string;
  letter: string;
  modified_at: string;
  municipality: {
    id: string;
    name: {
      fi: string;
      sv: string;
    };
  };
  street: {
    name: {
      fi: string;
      sv?: string;
      en?: string;
    };
  };
  location: {
    type: 'Point';
    coordinates: [number, number];
  };
}

export interface ServiceMapResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Array<ServiceMapAddress>;
}

export interface AddressResult {
  x: number;
  y: number;
  label: string;
}
