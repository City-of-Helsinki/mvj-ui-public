import 'leaflet';

declare module 'leaflet' {
  export type MeasurementOptions = {
    showOnHover: boolean;
    showTotalDistance: boolean;
    minDistance: number;
    formatDistance: (distance: number) => string;
    formatArea: (area: number) => string;
  };

  interface Layer {
    showMeasurements(options?: Partial<MeasurementOptions>): void;
    hideMeasurements(): void;
    updateMeasurements(): void;
  }
}
