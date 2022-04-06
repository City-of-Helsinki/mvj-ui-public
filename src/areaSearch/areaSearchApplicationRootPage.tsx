import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { initialize, reduxForm, InjectedFormProps } from 'redux-form';

import { fetchFormAttributes } from '../application/actions';
import { AREA_SEARCH_FORM_NAME } from './types';
import { initializeAreaSearchForm } from './helpers';

interface State {
  areaSearchForm: null;
}

export interface Props {
  initializeForm: typeof initialize;
  children: (props: InjectedFormProps<unknown, Props>) => JSX.Element;
}

const AreaSearchApplicationRootPage = ({
  children,
  initializeForm,
  ...rest
}: Props & InjectedFormProps<unknown, Props>): JSX.Element => {
  useEffect(() => {
    initializeForm(AREA_SEARCH_FORM_NAME, initializeAreaSearchForm());
  }, []);

  return <div>{children(rest)}</div>;
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
  reduxForm<unknown, Props>({
    form: AREA_SEARCH_FORM_NAME,
  })(AreaSearchApplicationRootPage)
);
