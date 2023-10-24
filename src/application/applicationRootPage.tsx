import { PropsWithChildren, useEffect } from 'react';
import { connect } from 'react-redux';
import { reduxForm, initialize } from 'redux-form';

import { APPLICATION_FORM_NAME, ApplicationFormRoot } from './types';
import { getInitialApplicationForm } from './helpers';
import { RootState } from '../root/rootReducer';
import { PlotSearch } from '../plotSearch/types';
import { fetchPlotSearches } from '../plotSearch/actions';
import {
  fetchFormAttributes,
  resetLastApplicationSubmissionError,
} from './actions';
import ScrollToTop from '../common/ScrollToTop';
import { validateApplicationForm } from './validations';

interface State {
  formTemplate: ApplicationFormRoot;
  plotSearches: Array<PlotSearch>;
}

interface Props {
  initializeForm: typeof initialize;
  formTemplate: ApplicationFormRoot;
  plotSearches: Array<PlotSearch>;
  fetchPlotSearches: () => void;
  fetchFormAttributes: () => void;
  resetLastApplicationSubmissionError: () => void;
}

const ApplicationRootPage = ({
  initializeForm,
  formTemplate,
  plotSearches,
  children,
  fetchPlotSearches,
  fetchFormAttributes,
  resetLastApplicationSubmissionError,
}: PropsWithChildren<Props>): JSX.Element => {
  useEffect(() => {
    initializeForm(APPLICATION_FORM_NAME, formTemplate, true);
  }, [plotSearches]);

  useEffect(() => {
    fetchPlotSearches();
    fetchFormAttributes();
    resetLastApplicationSubmissionError();
  }, []);

  return (
    <>
      <ScrollToTop />
      {children}
    </>
  );
};

export default connect(
  (state: RootState): State => ({
    formTemplate: getInitialApplicationForm(state),
    plotSearches: state.plotSearch.plotSearches,
  }),
  {
    initializeForm: initialize,
    fetchPlotSearches,
    fetchFormAttributes,
    resetLastApplicationSubmissionError,
  },
)(
  reduxForm<unknown, PropsWithChildren<Props>>({
    form: APPLICATION_FORM_NAME,
    validate: validateApplicationForm(''),
  })(ApplicationRootPage),
);
