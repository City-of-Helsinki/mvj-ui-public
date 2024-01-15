import { useEffect } from 'react';
import L from 'leaflet';
import { useMap } from 'react-leaflet';

interface Props {
  whenCreated: (map: L.Map) => void;
}

const MapReadyHandler = ({ whenCreated }: Props): null => {
  const map = useMap();

  useEffect(() => {
    whenCreated(map);
  }, [map]);

  return null;
};

export default MapReadyHandler;
