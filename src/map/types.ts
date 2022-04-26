import i18n from '../i18n';

export enum MapLayer {
  generalMap = 'generalMap',
  orthographic = 'orthographic',
  cityPlan = 'cityPlan',
  baseMap = 'baseMap',
  helsinkiOwnedAreas = 'helsinkiOwnedAreas',
}

export type MapLayerProperties = {
  identifier: string;
  url: string;
  format: string;
  layers: string;
  label: string;
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
    url: 'https://kartta.hel.fi/ws/geoserver/helsinki/wms?',
    layers: 'Helsingin_maanomistus-_ja_vuokrausalueet',
    format: 'image/png',
    label: i18n.t(
      'map.mapLayers.helsinkiOwnedAreas',
      'Areas owned by the City of Helsinki'
    ),
  },
};
