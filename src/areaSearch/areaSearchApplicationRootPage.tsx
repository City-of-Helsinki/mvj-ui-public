import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { initialize, reduxForm, InjectedFormProps } from 'redux-form';
import { useTranslation } from 'react-i18next';

import i18n from '../i18n';
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
import { Container } from 'react-grid-system';
import AuthDependentContent from '../auth/components/authDependentContent';
import { openLoginModal } from '../login/actions';
import ScrollToTop from '../common/ScrollToTop';
import { resetAreaSearchState, setAreaSearchStep } from './actions';
import { AreaSearchStepperPageIndex } from './helpers';
import { FileUploadsProvider } from '../form/FileUploadsContext';

interface State {
  areaSearchForm: null;
  lastSubmission: AreaSearch | null;
  currentStep: number;
}

interface Step {
  order: number;
  label: string;
  state: number;
}

export interface Props extends State {
  openLoginModal: () => void;
  initializeForm: typeof initialize;
  fetchFormAttributes: () => void;
  setAreaSearchStep: typeof setAreaSearchStep;
  resetAreaSearchState: typeof resetAreaSearchState;
}

const AreaSearchApplicationRootPage = ({
  openLoginModal,
  initializeForm,
  fetchFormAttributes,
  valid,
  currentStep,
  setAreaSearchStep,
  resetAreaSearchState,
  lastSubmission,
}: Props & InjectedFormProps<unknown, Props>): JSX.Element => {
  const { t } = useTranslation();
  const [steps, setSteps] = useState<Step[]>([
    {
      order: 1,
      label: t('areaSearch.specs.stepperHeading', 'Alueen valinta'),
      state: StepState.available,
    },
    {
      order: 2,
      label: t('areaSearch.application.stepperHeading', 'Hakemuksen täyttö'),
      state: StepState.disabled,
    },
    {
      order: 3,
      label: t('areaSearch.application.preview.stepperHeading', 'Esikatselu'),
      state: StepState.disabled,
    },
    {
      order: 4,
      label: t('areaSearch.success.stepperHeading', 'Lähetys'),
      state: StepState.disabled,
    },
  ]);

  const renderCurrentStep = () => {
    switch (steps[currentStep].order) {
      case 1: // 'Alueen valinta'
        return <AreaSearchSpecsPage valid={valid} />;
      case 2: // 'Hakemuksen täyttö'
        return <AreaSearchApplicationPage />;
      case 3: // 'Esikatselu'
        return <AreaSearchApplicationPreview />;
      case 4: // 'Lähetys'
        return (
          <AreaSearchApplicationSuccessPage
            applicationIdentifiers={lastSubmission?.identifier || ''}
          />
        );
      default:
        return null;
    }
  };

  const updateStepAvailability = () => {
    const newSteps = [...steps];
    const { SPECS, APPLICATION, PREVIEW, SUCCESS } = AreaSearchStepperPageIndex;

    switch (currentStep) {
      case SPECS:
        newSteps[APPLICATION].state = StepState.disabled;
        newSteps[PREVIEW].state = StepState.disabled;
        break;
      case APPLICATION:
        newSteps[APPLICATION].state = StepState.available;
        if (valid) {
          newSteps[PREVIEW].state = StepState.available;
        } else {
          newSteps[PREVIEW].state = StepState.disabled;
        }
        break;
      case PREVIEW:
        break;
      case SUCCESS:
        newSteps.forEach((step) => (step.state = StepState.disabled));
        break;
    }

    setSteps(newSteps);
  };

  useEffect(() => {
    resetAreaSearchState();
    initializeForm(AREA_SEARCH_FORM_NAME, initializeAreaSearchForm());
    fetchFormAttributes();
    return () => {
      resetAreaSearchState();
    };
  }, []);

  useEffect(() => {
    updateStepAvailability();
  }, [valid, currentStep]);

  return (
    <MainContentElement className="AreaSearchSpecsPage">
      <Helmet>
        <title>
          {getPageTitle(t('areaSearch.specs.pageTitle', 'Area search'))}
        </title>
      </Helmet>
      <Container>
        <FileUploadsProvider>
          <AuthDependentContent>
            {(_, loggedIn) =>
              loggedIn ? (
                <>
                  <div className="AreaSearchStepperWrapper">
                    <Stepper
                      steps={steps}
                      language={i18n.language}
                      selectedStep={currentStep}
                      onStepClick={(_, targetStepIndex) =>
                        setAreaSearchStep(targetStepIndex)
                      }
                    />
                  </div>
                  {renderCurrentStep()}
                </>
              ) : (
                <>
                  <ScrollToTop />
                  <h1>
                    {t(
                      'areaSearch.specs.heading',
                      'Apply for a land area lease',
                    )}
                  </h1>
                  <p>
                    {t(
                      'areaSearch.specs.notLoggedIn',
                      'To apply, please log in first.',
                    )}
                  </p>
                  <Button variant="primary" onClick={() => openLoginModal()}>
                    {t('areaSearch.specs.loginButton', 'Log in')}
                  </Button>
                </>
              )
            }
          </AuthDependentContent>
        </FileUploadsProvider>
      </Container>
    </MainContentElement>
  );
};

export default connect(
  (state: RootState): State => ({
    areaSearchForm: null,
    lastSubmission: state.areaSearch.lastSubmission,
    currentStep: state.areaSearch.currentStep,
  }),
  {
    openLoginModal,
    initializeForm: initialize,
    fetchFormAttributes,
    setAreaSearchStep,
    resetAreaSearchState,
  },
)(
  reduxForm<unknown, Props>({
    form: AREA_SEARCH_FORM_NAME,
    destroyOnUnmount: false,
    shouldError: (...args) =>
      shouldApplicationFormValidate<unknown, Props>(...args),
    validate: (values, props) =>
      validateApplicationForm('form')(values, props.lastSubmission?.form),
  })(AreaSearchApplicationRootPage),
);
