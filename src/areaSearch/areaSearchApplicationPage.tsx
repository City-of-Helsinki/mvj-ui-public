import { useState } from 'react';
import { Button } from 'hds-react';
import { Col, Container, Row } from 'react-grid-system';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { isValid } from 'redux-form';

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

interface State {
  lastSubmission: AreaSearch | null;
  isSubmittingAreaSearch: boolean;
  isFormValid: boolean;
}

interface Props extends State {
  openLoginModal: () => void;
  setNextStep: any;
}

const AreaSearchApplicationPage = ({
  openLoginModal,
  isSubmittingAreaSearch,
  lastSubmission,
  isFormValid,
  setNextStep,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const [isSaveClicked, setSaveClicked] = useState<boolean>(false);

  const openPreview = () => {
    setSaveClicked(true);

    if (isFormValid) {
      setNextStep();
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
                        'Area search application'
                      )
                    )}
                  </title>
                </Helmet>
                <Container>
                  <h1>
                    {t(
                      'areaSearch.application.heading',
                      'Area search application'
                    )}
                  </h1>
                  {lastSubmission && <AreaSearchTargetSummary />}
                  <div className="ApplicationPage__form-container">
                    {loading || isSubmittingAreaSearch ? (
                      <BlockLoader />
                    ) : (
                      <>
                        {loggedIn ? (
                          <>
                            {!lastSubmission ? (
                              <p>
                                {t(
                                  'areaSearch.application.error.noAreaSelected',
                                  "To submit an area application, you have to select the area you're applying for on the area search page first."
                                )}
                              </p>
                            ) : (
                              <>
                                {lastSubmission.form && (
                                  <>
                                    <ApplicationForm
                                      formName={AREA_SEARCH_FORM_NAME}
                                      baseForm={lastSubmission.form}
                                    />
                                    <Row className="ApplicationPage__action-buttons">
                                      <Col xs={12}>
                                        <Button
                                          variant="primary"
                                          onClick={() => setNextStep()}
                                          disabled={false}
                                        >
                                          {t(
                                            'application.previewButton',
                                            'Preview submission'
                                          )}
                                        </Button>
                                      </Col>
                                    </Row>
                                  </>
                                )}
                              </>
                            )}
                          </>
                        ) : (
                          <>
                            <p>
                              {t(
                                'areaSearch.application.error.notLoggedIn',
                                'Please log in to send an application for an area.'
                              )}
                            </p>
                            <Button
                              variant="primary"
                              onClick={() => openLoginModal()}
                            >
                              {t(
                                'areaSearch.application.loginButton',
                                'Log in'
                              )}
                            </Button>
                          </>
                        )}
                      </>
                    )}
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
  }),
  {
    openLoginModal,
  },
)(AreaSearchApplicationPage);
