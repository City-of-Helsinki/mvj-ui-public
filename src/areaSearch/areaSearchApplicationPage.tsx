import { useEffect, useReducer, useState } from 'react';
import { Button } from 'hds-react';
import { Col, Container, Row } from 'react-grid-system';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { isValid, setSubmitSucceeded } from 'redux-form';

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

interface State {
  lastSubmission: AreaSearch | null;
  isSubmittingAreaSearch: boolean;
  isFormValid: boolean;
  currentStep: number;
}

interface Props extends State {
  openLoginModal: () => void;
}

const AreaSearchApplicationPage = ({
  openLoginModal,
  isSubmittingAreaSearch,
  lastSubmission,
  isFormValid,
  currentStep,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const [isSaveClicked, setSaveClicked] = useState<boolean>(false);
  const [_, forceUpdate] = useReducer((x) => x + 1, 0);

  const openPreview = () => {
    setSaveClicked(true);

    if (isFormValid) {
      // setNextStep();
    }
  };

  useEffect(() => {
    forceUpdate();
  }, [currentStep]);

  const renderApplicationForm = (
    lastSubmission: AreaSearch,
    loading: boolean,
    loggedIn: boolean,
  ) => {
    console.log('HEP');
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
          console.log('auth lastsub', lastSubmission);
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
                    {lastSubmission &&
                      renderApplicationForm(lastSubmission, loading, loggedIn)}
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
    currentStep: state.areaSearch.currentStep,
  }),
  {
    openLoginModal,
  },
)(AreaSearchApplicationPage);
