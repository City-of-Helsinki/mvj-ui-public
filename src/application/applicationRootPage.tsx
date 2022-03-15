import React, { PropsWithChildren, useEffect } from 'react';
import { connect } from 'react-redux';
import { reduxForm, initialize } from 'redux-form';

import { APPLICATION_FORM_NAME, NestedField } from './types';
import { getInitialApplicationForm } from './helpers';
import { RootState } from '../root/rootReducer';
import { PlotSearch } from '../plotSearch/types';

interface State {
  formTemplate: NestedField;
  plotSearches: Array<PlotSearch>;
}

interface Props {
  initializeForm: typeof initialize;
  formTemplate: NestedField;
  plotSearches: Array<PlotSearch>;
}

const ApplicationRootPage = ({
  initializeForm,
  formTemplate,
  plotSearches,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  useEffect(() => {
    initializeForm(APPLICATION_FORM_NAME, formTemplate, true);
  }, [plotSearches]);

  return <>{children}</>;
};

export default connect(
  (state: RootState): State => ({
    formTemplate: getInitialApplicationForm(state),
    plotSearches: state.plotSearch.plotSearches,
  }),
  {
    initializeForm: initialize,
  }
)(
  reduxForm<unknown, PropsWithChildren<Props>>({
    form: APPLICATION_FORM_NAME,
  })(ApplicationRootPage)
);
