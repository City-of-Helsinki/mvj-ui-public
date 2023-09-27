import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import { GeoSearchControl } from 'leaflet-geosearch';
import i18n from '../i18n';

import HelsinkiProvider from './HelsinkiProvider';

const GeoSearch = (): null => {
  const map = useMap();

  const provider = new HelsinkiProvider();

  // Non-class based old style objects are basically extinct in modern JS and are only barely supported by TS,
  // but for whatever reason, this library still relies on them. Its own typing doesn't define that new constructor
  // though, so we'd end up with error TS7009. We'll circumvent this by skipping typing here.
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const searchControl = new (GeoSearchControl as any)({
    provider: provider,
    position: 'topright',
    style: 'bar',
    showMarker: false,
    showPopup: false,
    autoClose: true,
    retainZoomLevel: false,
    animateZoom: true,
    keepResult: false,
    searchLabel: i18n.t('map.geoSearch.searchLabel', 'Search for an address'),
    zoomLevel: 9,
    marker: {
      draggable: false,
    },
    autoComplete: true,
    autoCompleteDelay: 250,
  });

  useEffect(() => {
    map.addControl(searchControl);

    return () => {
      map.removeControl(searchControl);
    };
  }, []);

  return null;
};

export default GeoSearch;
