import React, { PropsWithChildren, useEffect } from 'react';
import { connect } from 'react-redux';
import { reduxForm, initialize } from 'redux-form';

import { APPLICATION_FORM_NAME, NestedField } from './types';
import { getInitialApplicationForm } from './helpers';
import { RootState } from '../root/rootReducer';

interface State {
  formTemplate: NestedField;
}

interface Props {
  initializeForm: typeof initialize;
  formTemplate: NestedField;
}

const ApplicationRootPage = ({
  initializeForm,
  formTemplate,
  children,
}: PropsWithChildren<Props>): JSX.Element => {
  useEffect(() => {
    initializeForm(APPLICATION_FORM_NAME, formTemplate, true);
  }, [formTemplate]);

  return <>{children}</>;
};

export default connect(
  (state: RootState): State => ({
    formTemplate: getInitialApplicationForm(state),
  }),
  {
    initializeForm: initialize,
  }
)(
  reduxForm<unknown, PropsWithChildren<Props>>({
    form: APPLICATION_FORM_NAME,
  })(ApplicationRootPage)
);
