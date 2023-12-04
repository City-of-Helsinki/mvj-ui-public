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
import { Button, StepState, Stepper } from 'hds-react';
import AreaSearchSpecsPage from './areaSearchSpecsPage';
import AreaSearchApplicationPage from './areaSearchApplicationPage';
import AreaSearchApplicationPreview from './areaSearchApplicationPreview';
import AreaSearchApplicationSuccessPage from './areaSearchApplicationSuccessPage';
import MainContentElement from '../a11y/MainContentElement';
import { Helmet } from 'react-helmet';
import { getPageTitle } from '../root/helpers';
import { t } from 'i18next';
import { Container } from 'react-grid-system';
import AuthDependentContent from '../auth/components/authDependentContent';
import { openLoginModal } from '../login/actions';
import ScrollToTop from '../common/ScrollToTop';

interface State {
  areaSearchForm: null;
  lastSubmission: AreaSearch | null;
}

interface Step {
  label: string;
  state: number;
}

export interface Props {
  openLoginModal: () => void;
  lastSubmission: AreaSearch | null;
  initializeForm: typeof initialize;
  fetchFormAttributes: () => void;
}

const AreaSearchApplicationRootPage = ({
  openLoginModal,
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
      state: StepState.available,
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
        return <AreaSearchApplicationPage setNextStep={setNextStep} />;
      case 'Esikatselu':
        return (
          <AreaSearchApplicationPreview
            setPreviousStep={setPreviousStep}
            setNextStep={setNextStep}
          />
        );
      case 'Lähetys':
        return <AreaSearchApplicationSuccessPage />;
      default:
        return null;
    }
  };

  const toggleValidSpecs = () => {
    const newSteps = [...steps];

    if (!valid) {
      newSteps[1].state = StepState.disabled;
      newSteps[2].state = StepState.disabled;
    } else if (valid) {
      newSteps[1].state = StepState.available;
      newSteps[2].state = StepState.available;
    }

    setSteps(newSteps);
  };

  useEffect(() => {
    initializeForm(AREA_SEARCH_FORM_NAME, initializeAreaSearchForm());
  }, []);

  useEffect(() => {
    fetchFormAttributes();
  }, []);

  useEffect(() => {
    toggleValidSpecs();
  }, [valid]);

  return (
    <MainContentElement className="AreaSearchSpecsPage">
      <Helmet>
        <title>
          {getPageTitle(t('areaSearch.specs.pageTitle', 'Area search'))}
        </title>
      </Helmet>
      <Container>
        <AuthDependentContent>
          {(_, loggedIn) =>
            loggedIn ? (
              <>
                <div className="AreaSearchStepperWrapper">
                  <Stepper
                    steps={steps}
                    language="en"
                    selectedStep={currentStep}
                    onStepClick={(_, nextPageIndex) =>
                      setCurrentStep(nextPageIndex)
                    }
                  />
                </div>
                {renderCurrentStep()}
              </>
            ) : (
              <>
                <ScrollToTop />
                <h1>
                  {t('areaSearch.specs.heading', 'Apply for a land area lease')}
                </h1>
                <p>
                  {t(
                    'areaSearch.specs.notLoggedIn',
                    'To apply, please log in first.'
                  )}
                </p>
                <Button variant="primary" onClick={() => openLoginModal()}>
                  {t('areaSearch.specs.loginButton', 'Log in')}
                </Button>
              </>
            )
          }
        </AuthDependentContent>
      </Container>
    </MainContentElement>
  );
};

export default connect(
  (state: RootState): State => ({
    areaSearchForm: null,
    lastSubmission: state.areaSearch.lastSubmission,
  }),
  {
    openLoginModal,
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
