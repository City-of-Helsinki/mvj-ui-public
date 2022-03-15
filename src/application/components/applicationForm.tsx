import React from 'react';

import { ApplicationSectionKeys } from '../types';
import { Form } from '../../plotSearch/types';
import ApplicationFormSubsection from './applicationFormSubsection';

interface Props {
  baseForm: Form;
}

const ApplicationForm = ({ baseForm }: Props): JSX.Element => {
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

export default ApplicationForm;
