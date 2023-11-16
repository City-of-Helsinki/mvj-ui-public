import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { initialize, reduxForm, InjectedFormProps } from 'redux-form';

import { fetchFormAttributes } from '../application/actions';
import { AreaSearch, AREA_SEARCH_FORM_NAME } from './types';
import { initializeAreaSearchForm } from './helpers';
import { RootState } from '../root/rootReducer';
import {
  shouldApplicationFormValidate,
  validateApplicationForm,
} from '../application/validations';
import { StepState, Stepper } from 'hds-react';
import AreaSearchSpecsPage from './areaSearchSpecsPage';
import AreaSearchApplicationPage from './areaSearchApplicationPage';
import AreaSearchApplicationPreview from './areaSearchApplicationPreview';
import AreaSearchApplicationSuccessPage from './areaSearchApplicationSuccessPage';

interface State {
  areaSearchForm: null;
  lastSubmission: AreaSearch | null;
}

interface Step {
  label: string;
  state: number;
}

export interface Props {
  lastSubmission: AreaSearch | null;
  initializeForm: typeof initialize;
  fetchFormAttributes: () => void;
}

const AreaSearchApplicationRootPage = ({
  lastSubmission,
  initializeForm,
  fetchFormAttributes,
}: Props & InjectedFormProps<unknown, Props>): JSX.Element => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const [steps, setSteps] = useState<Step[]>([
    {
      label: 'Alueen valinta',
      state: StepState.available,
    },
    {
      label: 'Hakemuksen täyttö',
      state: StepState.available,
    },
    {
      label: 'Esikatselu',
      state: StepState.available,
    },
    {
      label: 'Lähetys',
      state: StepState.available,
    },
  ]);

  const renderCurrentStep = () => {
    switch (steps[currentStep].label) {
      case 'Alueen valinta':
        return <AreaSearchSpecsPage valid={false} />;
      case 'Hakemuksen täyttö':
        return <AreaSearchApplicationPage />;
      case 'Esikatselu':
        return <AreaSearchApplicationPreview />;
      case 'Lähetys':
        return <AreaSearchApplicationSuccessPage />;
      default:
        return null;
    }
  };

  useEffect(() => {
    initializeForm(AREA_SEARCH_FORM_NAME, initializeAreaSearchForm());
  }, [lastSubmission]);

  useEffect(() => {
    fetchFormAttributes();
  }, []);

  return (
    <div>
      <Stepper
        steps={steps}
        language="en"
        selectedStep={currentStep}
        onStepClick={(_, nextPageIndex) => setCurrentStep(nextPageIndex)}
      />
      {renderCurrentStep()}
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
    shouldError: (...args) =>
      shouldApplicationFormValidate<unknown, Props>(...args),
    validate: (values, props) =>
      validateApplicationForm('form')(values, props.lastSubmission?.form),
  })(AreaSearchApplicationRootPage),
);
