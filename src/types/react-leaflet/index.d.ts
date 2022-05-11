import 'leaflet';
import { LeafletEventHandlerFn } from 'leaflet';

declare module 'leaflet' {
  interface LeafletEventHandlerFnMap {
    focus?: LeafletEventHandlerFn | undefined;
    blur?: LeafletEventHandlerFn | undefined;
  }
}
