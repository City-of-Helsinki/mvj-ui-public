import {
  AREA_SEARCH_FORM_NAME,
  AreaSearchFormRoot,
  AreaSearchSubmission,
} from './types';
import { getFormValues } from 'redux-form';
import { store } from '../index';

export const initializeAreaSearchForm = (): AreaSearchFormRoot => {
  return {
    search: {
      start_date: '',
      end_date: '',
      description_area: '',
      description_intended_use: '',
      intended_use_category: null,
      intended_use: null,
      geometry: null,
      attachments: 0,
    },
    form: {
      sections: {},
      sectionTemplates: {},
      fileFieldIds: [],
    },
  };
};

export const prepareAreaSearchSubmission = (
  files: Record<string, Array<File>>
): AreaSearchSubmission => {
  const formData = getFormValues(AREA_SEARCH_FORM_NAME)(
    store.getState()
  ) as AreaSearchFormRoot;
  const { intended_use_category, intended_use, ...rest } = formData.search;

  return {
    ...rest,
    // Should already be validated to not be null at this stage
    intended_use: intended_use as number,
    attachments: Object.keys(files).reduce((acc, field) => {
      acc.push(...files[field]);
      return acc;
    }, [] as Array<File>),
    // TODO: mock value
    geometry: {
      type: 'MultiPolygon',
      coordinates: [
        [
          [
            [0, 0],
            [0, 1],
            [1, 1],
            [1, 0],
            [0, 0],
          ],
        ],
      ],
    },
  };
};
