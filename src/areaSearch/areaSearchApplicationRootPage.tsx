import React, { PropsWithChildren, useEffect } from 'react';
import { connect } from 'react-redux';
import { initialize, reduxForm } from 'redux-form';

import { fetchFormAttributes } from '../application/actions';
import { AREA_SEARCH_FORM_NAME } from './types';
import { initializeAreaSearchForm } from './helpers';

interface State {
  areaSearchForm: null;
}

interface Props {
  initializeForm: typeof initialize;
}

const AreaSearchApplicationRootPage = ({
  children,
  initializeForm,
}: PropsWithChildren<Props>): JSX.Element => {
  useEffect(() => {
    initializeForm(AREA_SEARCH_FORM_NAME, initializeAreaSearchForm());
  }, []);

  return <div>{children}</div>;
};

export default connect(
  (): State => ({
    areaSearchForm: null,
  }),
  {
    initializeForm: initialize,
    fetchFormAttributes,
  }
)(
  reduxForm<unknown, PropsWithChildren<Props>>({
    form: AREA_SEARCH_FORM_NAME,
  })(AreaSearchApplicationRootPage)
);
