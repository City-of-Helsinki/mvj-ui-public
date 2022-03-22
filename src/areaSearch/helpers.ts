import { AreaSearchFormRoot } from './types';

export const initializeAreaSearchForm = (): AreaSearchFormRoot => {
  return {
    search: {
      start_date: '',
      end_date: '',
      description_area: '',
      description_project: '',
      intended_use: null,
      geometry: null,
    },
    form: {
      sections: {},
      sectionTemplates: {},
      fileFieldIds: [],
    },
  };
};
