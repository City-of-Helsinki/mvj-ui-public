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
import {
  shouldApplicationFormValidate,
  validateApplicationForm,
} from './validations';
import { getPlotSearchFromFavourites } from '../favourites/helpers';

interface State {
  formTemplate: ApplicationFormRoot;
  plotSearches: Array<PlotSearch>;
  relevantPlotSearch: PlotSearch | null;
}

interface Props {
  initializeForm: typeof initialize;
  formTemplate: ApplicationFormRoot;
  plotSearches: Array<PlotSearch>;
  fetchPlotSearches: () => void;
  fetchFormAttributes: () => void;
  resetLastApplicationSubmissionError: () => void;
  relevantPlotSearch: PlotSearch | null;
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
    relevantPlotSearch: getPlotSearchFromFavourites(state),
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
    shouldError: (...args) =>
      shouldApplicationFormValidate<unknown, Props>(...args),
    validate: (values, props) =>
      validateApplicationForm('')(values, props.relevantPlotSearch?.form),
  })(ApplicationRootPage),
);
