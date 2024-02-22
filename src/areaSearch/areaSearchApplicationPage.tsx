import { useEffect, useState } from 'react';
import { Button } from 'hds-react';
import { Col, Container, Row } from 'react-grid-system';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { FormAction, change, isValid } from 'redux-form';

import MainContentElement from '../a11y/MainContentElement';
import AuthDependentContent from '../auth/components/authDependentContent';
import BlockLoader from '../loader/blockLoader';
import { openLoginModal } from '../login/actions';
import { getPageTitle } from '../root/helpers';
import { RootState } from '../root/rootReducer';
import { AreaSearch, AREA_SEARCH_FORM_NAME } from './types';
import AreaSearchTargetSummary from './components/areaSearchTargetSummary';
import ApplicationForm from './components/applicationForm';
import ScrollToTop from '../common/ScrollToTop';
import ApplicationErrorsSummary from '../application/components/ApplicationErrorsSummary';
import {
  AreaSearchStepperPageIndex,
  getInitialAreaSearchApplicationForm,
} from './helpers';
import { ApplicationFormRoot } from '../application/types';
import { setUpAreaSearchApplicationForm, setAreaSearchStep } from './actions';
import { isAreaSearchApplicationFormSetUp } from './selectors';
import { Action } from 'redux';

interface State {
  lastSubmission: AreaSearch | null;
  isSubmittingAreaSearch: boolean;
  isFormValid: boolean;
  applicationFormTemplate: ApplicationFormRoot;
  areaSearchApplicationFormSetUp: boolean;
}

interface Props extends State {
  openLoginModal: () => void;
  change: (
    form: string,
    field: string,
    value: any,
    touch?: boolean,
    persistentSubmitErrors?: boolean,
  ) => FormAction;
  setAreaSearchStep: (payload: number) => Action<string>;
  setUpAreaSearchApplicationForm: () => Action<string>;
}

const AreaSearchApplicationPage = ({
  openLoginModal,
  change,
  isSubmittingAreaSearch,
  lastSubmission,
  isFormValid,
  applicationFormTemplate,
  setAreaSearchStep,
  areaSearchApplicationFormSetUp,
  setUpAreaSearchApplicationForm,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const [isSaveClicked, setSaveClicked] = useState<boolean>(false);

  const openPreview = () => {
    setSaveClicked(true);

    if (isFormValid) {
      setAreaSearchStep(AreaSearchStepperPageIndex.PREVIEW);
    }
  };

  useEffect(() => {
    if (!areaSearchApplicationFormSetUp) {
      change(AREA_SEARCH_FORM_NAME, 'form', applicationFormTemplate, true);
      setUpAreaSearchApplicationForm();
    }
  }, []);

  const renderApplicationForm = (loading: boolean, loggedIn: boolean) => {
    if (loading || isSubmittingAreaSearch) {
      return <BlockLoader />;
    } else if (loggedIn) {
      if (lastSubmission?.form) {
        return (
          <>
            <ApplicationForm
              formName={AREA_SEARCH_FORM_NAME}
              baseForm={lastSubmission.form}
            />
            <Row className="ApplicationPage__notifications">
              <Col xs={12}>
                <ApplicationErrorsSummary
                  baseForm={lastSubmission.form}
                  formName={AREA_SEARCH_FORM_NAME}
                  isSaveClicked={isSaveClicked}
                  pathPrefix="form"
                />
              </Col>
            </Row>
            <Row className="ApplicationPage__action-buttons">
              <Col xs={12}>
                <Button
                  variant="secondary"
                  onClick={() =>
                    setAreaSearchStep(AreaSearchStepperPageIndex.SPECS)
                  }
                >
                  {t('areaSearch.application.backButton', 'Back')}
                </Button>
                <Button
                  variant="primary"
                  onClick={openPreview}
                  disabled={!isFormValid && isSaveClicked}
                >
                  {t('application.previewButton', 'Preview submission')}
                </Button>
              </Col>
            </Row>
          </>
        );
      } else {
        return (
          <p>
            {t(
              'areaSearch.application.error.noAreaSelected',
              "To submit an area application, you have to select the area you're applying for on the area search page first.",
            )}
          </p>
        );
      }
    } else {
      return (
        <>
          <p>
            {t(
              'areaSearch.application.error.notLoggedIn',
              'Please log in to send an application for an area.',
            )}
          </p>
          <Button variant="primary" onClick={() => openLoginModal()}>
            {t('areaSearch.application.loginButton', 'Log in')}
          </Button>
        </>
      );
    }
  };

  return (
    <>
      <ScrollToTop />
      <AuthDependentContent>
        {(loading, loggedIn) => {
          return (
            <>
              <MainContentElement className="ApplicationPage">
                <Helmet>
                  <title>
                    {getPageTitle(
                      t(
                        'areaSearch.application.form.pageTitle',
                        'Area search application',
                      ),
                    )}
                  </title>
                </Helmet>
                <Container>
                  <h1>
                    {t(
                      'areaSearch.application.heading',
                      'Area search application',
                    )}
                  </h1>
                  {lastSubmission && <AreaSearchTargetSummary />}
                  <div className="ApplicationPage__form-container">
                    {renderApplicationForm(loading, loggedIn)}
                  </div>
                </Container>
              </MainContentElement>
            </>
          );
        }}
      </AuthDependentContent>
    </>
  );
};

export default connect(
  (state: RootState): State => ({
    lastSubmission: state.areaSearch.lastSubmission,
    isSubmittingAreaSearch: state.areaSearch.isSubmittingAreaSearch,
    isFormValid: isValid(AREA_SEARCH_FORM_NAME)(state),
    applicationFormTemplate: getInitialAreaSearchApplicationForm(state),
    areaSearchApplicationFormSetUp: isAreaSearchApplicationFormSetUp(state),
  }),
  {
    openLoginModal,
    change,
    setAreaSearchStep,
    setUpAreaSearchApplicationForm,
  },
)(AreaSearchApplicationPage);
