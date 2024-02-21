import { formValueSelector } from 'redux-form';
import { Selector } from 'react-redux';

import { APPLICANT_SECTION_IDENTIFIER, ApplicationSectionKeys } from './types';
import { RootState } from '../root/rootReducer';

export const getCurrentApplicantCount: Selector<RootState, number, string> = (
  state: RootState,
  formName: string,
): number => {
  const selector = formValueSelector(formName);
  return (
    selector(state, ApplicationSectionKeys.Subsections)?.[
      APPLICANT_SECTION_IDENTIFIER
    ]?.length || 0
  );
};
