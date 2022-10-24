import { formValueSelector } from 'redux-form';
import { Selector } from 'react-redux';

import {
  APPLICATION_FORM_NAME,
  APPLICANT_SECTION_IDENTIFIER,
  ApplicationSectionKeys,
  FieldTypeMapping,
} from './types';
import { RootState } from '../root/rootReducer';

export const getFieldTypeMapping: Selector<RootState, FieldTypeMapping> = (
  state: RootState
): FieldTypeMapping => state.application.fieldTypeMapping;

export const getCurrentApplicantCount: Selector<RootState, number> = (
  state: RootState
): number => {
  const selector = formValueSelector(APPLICATION_FORM_NAME);
  return (
    selector(state, ApplicationSectionKeys.Subsections)?.[
      APPLICANT_SECTION_IDENTIFIER
    ]?.length || 0
  );
};
