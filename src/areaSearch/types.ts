import { ApplicationFormRoot } from '../application/types';
import { Geometry } from 'geojson';

export const AREA_SEARCH_FORM_NAME = 'areaSearch';

export type AreaSearchFormRoot = {
  search: {
    start_date: string;
    end_date: string;
    description_area: string;
    description_project: string;
    intended_use: number | null;
    geometry: Geometry | null;
  };
  form: ApplicationFormRoot;
};
