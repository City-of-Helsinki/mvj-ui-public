import React from 'react';
import { InjectedFormProps, reduxForm } from 'redux-form';
import { connect } from 'react-redux';

import { RootState } from '../../root/rootReducer';
import { getInitialApplicationForm } from '../helpers';
import {
  APPLICATION_FORM_NAME,
  ApplicationSectionKeys,
  NestedField,
} from '../types';
import { Form } from '../../plotSearch/types';
import ApplicationFormSubsection from './applicationFormSubsection';

interface Props {
  baseForm: Form;
}

interface State {
  initialValues: NestedField;
}

const ApplicationForm = ({
  baseForm,
}: Props & InjectedFormProps<unknown, Props>): JSX.Element => {
  return (
    <form className="ApplicationForm">
      {baseForm.sections.map((section) => (
        <ApplicationFormSubsection
          path={[ApplicationSectionKeys.Subsections]}
          section={section}
          headerTag="h2"
          key={section.id}
        />
      ))}
    </form>
  );
};

export default connect(
  (state: RootState): State => ({
    initialValues: getInitialApplicationForm(state),
  })
)(
  reduxForm<unknown, Props>({
    form: APPLICATION_FORM_NAME,
  })(ApplicationForm)
);
