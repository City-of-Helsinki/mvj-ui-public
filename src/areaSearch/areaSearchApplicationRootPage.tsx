import { useEffect } from 'react';
import { connect } from 'react-redux';
import { initialize, reduxForm, InjectedFormProps } from 'redux-form';

import { fetchFormAttributes } from '../application/actions';
import { AreaSearch, AREA_SEARCH_FORM_NAME } from './types';
import { initializeAreaSearchForm } from './helpers';
import { RootState } from '../root/rootReducer';
import ScrollToTop from '../common/ScrollToTop';
import { validateApplicationForm } from '../application/validations';

interface State {
  areaSearchForm: null;
  lastSubmission: AreaSearch | null;
}

export interface Props {
  lastSubmission: AreaSearch | null;
  initializeForm: typeof initialize;
  fetchFormAttributes: () => void;
  children: (props: InjectedFormProps<unknown, Props>) => JSX.Element;
}

const AreaSearchApplicationRootPage = ({
  lastSubmission,
  children,
  initializeForm,
  fetchFormAttributes,
  ...rest
}: Props & InjectedFormProps<unknown, Props>): JSX.Element => {
  useEffect(() => {
    initializeForm(AREA_SEARCH_FORM_NAME, initializeAreaSearchForm());
  }, [lastSubmission]);

  useEffect(() => {
    fetchFormAttributes();
  }, []);

  return (
    <div>
      <ScrollToTop />
      {children(rest)}
    </div>
  );
};

export default connect(
  (state: RootState): State => ({
    areaSearchForm: null,
    lastSubmission: state.areaSearch.lastSubmission,
  }),
  {
    initializeForm: initialize,
    fetchFormAttributes,
  },
)(
  reduxForm<unknown, Props>({
    form: AREA_SEARCH_FORM_NAME,
    validate: validateApplicationForm('form'),
  })(AreaSearchApplicationRootPage),
);
