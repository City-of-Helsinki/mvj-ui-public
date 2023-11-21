import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { initialize, reduxForm, InjectedFormProps } from 'redux-form';

import { fetchFormAttributes } from '../application/actions';
import { AreaSearch, AREA_SEARCH_FORM_NAME } from './types';
import { initializeAreaSearchForm } from './helpers';
import { RootState } from '../root/rootReducer';
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
  valid,
}: Props & InjectedFormProps<unknown, Props>): JSX.Element => {
  const [currentStep, setCurrentStep] = useState<number>(0);

  const setNextStep = () => {
    setCurrentStep(currentStep + 1);
  };

  const setPreviousStep = () => {
    setCurrentStep(currentStep - 1);
  };

  const [steps, setSteps] = useState<Step[]>([
    {
      label: 'Alueen valinta',
      state: StepState.available,
    },
    {
      label: 'Hakemuksen täyttö',
      state: StepState.disabled,
    },
    {
      label: 'Esikatselu',
      state: StepState.disabled,
    },
    {
      label: 'Lähetys',
      state: StepState.disabled,
    },
  ]);

  const renderCurrentStep = () => {
    switch (steps[currentStep].label) {
      case 'Alueen valinta':
        return <AreaSearchSpecsPage valid={valid} setNextStep={setNextStep} />;
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

  const toggleValidSpecs = () => {
    if (valid && steps[1].state !== StepState.available) {
      const newSteps = [...steps];
      newSteps[1].state = StepState.available;
      setSteps(newSteps);
    } else if (!valid && steps[1].state === StepState.available) {
      const newSteps = [...steps];
      newSteps[1].state = StepState.disabled;
      setSteps(newSteps);
    }
  };

  useEffect(() => {
    initializeForm(AREA_SEARCH_FORM_NAME, initializeAreaSearchForm());
  }, [lastSubmission]);

  useEffect(() => {
    fetchFormAttributes();
  }, []);

  useEffect(() => {
    toggleValidSpecs();
  }, [valid, toggleValidSpecs]);

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
  }
)(
  reduxForm<unknown, Props>({
    form: AREA_SEARCH_FORM_NAME,
  })(AreaSearchApplicationRootPage)
);
