import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Col, Container, Row } from 'react-grid-system';
import { Button, Notification } from 'hds-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { isPristine, isValid } from 'redux-form';

import { RootState } from '../root/rootReducer';
import { PlotSearch } from '../plotSearch/types';
import { fetchPendingUploads } from './actions';
import ApplicationForm from './components/applicationForm';
import BlockLoader from '../loader/blockLoader';
import AuthDependentContent from '../auth/components/authDependentContent';
import { openLoginModal } from '../login/actions';
import { getPlotSearchFromFavourites } from '../favourites/helpers';
import { getRouteById } from '../root/routes';
import ApplicationTargetList from './components/applicationTargetList';
import MainContentElement from '../a11y/MainContentElement';
import { getPageTitle } from '../root/helpers';
import { APPLICATION_FORM_NAME, TARGET_SECTION_IDENTIFIER } from './types';
import ApplicationErrorsSummary from './components/ApplicationErrorsSummary';
import { AppRoutes } from './helpers';

interface State {
  relevantPlotSearch: PlotSearch | null;
  isFetchingFormAttributes: boolean;
  isFetchingPlotSearches: boolean;
  isPerformingFileOperation: boolean;
  isTargetsPagePristine: boolean;
  isFormValid: boolean;
}

interface Props {
  relevantPlotSearch: PlotSearch | null;
  isFetchingFormAttributes: boolean;
  isFetchingPlotSearches: boolean;
  openLoginModal: () => void;
  isPerformingFileOperation: boolean;
  fetchPendingUploads: () => void;
  isTargetsPagePristine: boolean;
  isFormValid: boolean;
}

const ApplicationPage = ({
  relevantPlotSearch,
  isFetchingFormAttributes,
  isFetchingPlotSearches,
  openLoginModal,
  isPerformingFileOperation,
  fetchPendingUploads,
  isTargetsPagePristine,
  isFormValid,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [hasVisitedTargetsTab, setHasVisitedTargetsTab] =
    useState<boolean>(false);
  const [hasDismissedTargetsAlert, setHasDismissedTargetsAlert] =
    useState<boolean>(false);

  useEffect(() => {
    if (!isTargetsPagePristine) {
      setHasVisitedTargetsTab(true);
    }
  }, [isTargetsPagePristine]);

  const [isSaveClicked, setSaveClicked] = useState<boolean>(false);

  const hasTargetTab =
    relevantPlotSearch?.form?.sections.findIndex(
      (section) => section.identifier === TARGET_SECTION_IDENTIFIER,
    ) !== -1;

  const openPreview = () => {
    setSaveClicked(true);

    if (isFormValid) {
      navigate(getRouteById(AppRoutes.APPLICATION_PREVIEW));
    }
  };

  return (
    <AuthDependentContent>
      {(loading, loggedIn) => {
        useEffect(() => {
          if (loggedIn) {
            fetchPendingUploads();
          }
        }, [loggedIn]);

        return (
          <MainContentElement className="ApplicationPage">
            <Helmet>
              <title>
                {getPageTitle(
                  t('application.form.pageTitle', 'Plot application'),
                )}
              </title>
            </Helmet>
            <Container>
              <h1>{t('application.heading', 'Plot application')}</h1>
              <ApplicationTargetList />

              <div className="ApplicationPage__form-container">
                {isFetchingPlotSearches ||
                isFetchingFormAttributes ||
                loading ? (
                  <BlockLoader />
                ) : (
                  <>
                    {loggedIn ? (
                      <>
                        {relevantPlotSearch?.form && (
                          <>
                            <ApplicationForm
                              baseForm={relevantPlotSearch.form}
                              isSaveClicked={isSaveClicked}
                            />

                            <Row className="ApplicationPage__notifications">
                              <Col xs={12}>
                                <ApplicationErrorsSummary
                                  baseForm={relevantPlotSearch.form}
                                  formName={APPLICATION_FORM_NAME}
                                  isSaveClicked={isSaveClicked}
                                  pathPrefix=""
                                />
                                {!hasVisitedTargetsTab &&
                                  hasTargetTab &&
                                  !hasDismissedTargetsAlert && (
                                    <Notification
                                      type="error"
                                      label={
                                        <>
                                          {t(
                                            'application.mustVisitTargetPage.title',
                                            'Attention!',
                                          )}
                                        </>
                                      }
                                      closeButtonLabelText={
                                        t(
                                          'application.mustVisitTargetPage.close',
                                          'Close',
                                        ) as string
                                      }
                                      onClose={() =>
                                        setHasDismissedTargetsAlert(true)
                                      }
                                      dismissible
                                    >
                                      {t(
                                        'application.mustVisitTargetPage.text',
                                        "You must first fill the required details for the targets you're applying to in the second tab. You can open that tab by clicking the button below.",
                                      )}
                                    </Notification>
                                  )}
                              </Col>
                            </Row>

                            <Row className="ApplicationPage__action-buttons">
                              <Col xs={12}>
                                <Button
                                  variant="secondary"
                                  onClick={() =>
                                    navigate(getRouteById(AppRoutes.FAVOURITES))
                                  }
                                  disabled={isPerformingFileOperation}
                                >
                                  {t('application.buttons.cancel', 'Cancel')}
                                </Button>
                                <Button
                                  variant="primary"
                                  onClick={openPreview}
                                  disabled={
                                    isPerformingFileOperation ||
                                    (!hasVisitedTargetsTab && hasTargetTab) ||
                                    (isSaveClicked && !isFormValid)
                                  }
                                >
                                  {t(
                                    'application.buttons.preview',
                                    'Preview submission',
                                  )}
                                </Button>
                                {!hasVisitedTargetsTab && hasTargetTab && (
                                  <Button
                                    variant="primary"
                                    onClick={() => {
                                      const targetTab = document.getElementById(
                                        'ApplicationForm-TargetsTabAnchor',
                                      );
                                      if (!targetTab) {
                                        return;
                                      }

                                      // The element itself gets covered by the top navigation bar since we're not
                                      // offsetting its height, but that's perfectly fine in this case.
                                      targetTab.scrollIntoView();
                                      targetTab.click();
                                      setHasVisitedTargetsTab(true);
                                    }}
                                    disabled={isPerformingFileOperation}
                                  >
                                    {t(
                                      'application.buttons.viewTargets',
                                      'View targets',
                                    )}
                                  </Button>
                                )}
                              </Col>
                            </Row>
                          </>
                        )}
                        {!relevantPlotSearch && (
                          <p>
                            {t(
                              'application.error.noPlotsSelected',
                              'To submit a plot application, you have to pick plots on the plot searches page first.',
                            )}
                          </p>
                        )}
                        {relevantPlotSearch && !relevantPlotSearch.form && (
                          <p>
                            {t(
                              'application.error.noFormAvailable',
                              "No application form has been specified for the plots you have selected yet. Please be in contact and we'll look into it.",
                            )}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <p>
                          {t(
                            'application.error.notLoggedIn',
                            'Please log in first in order to apply for plots.',
                          )}
                        </p>
                        <Button
                          variant="primary"
                          onClick={() => openLoginModal()}
                        >
                          {t('application.buttons.login', 'Log in')}
                        </Button>
                      </>
                    )}
                  </>
                )}
              </div>
            </Container>
          </MainContentElement>
        );
      }}
    </AuthDependentContent>
  );
};

export default connect(
  (state: RootState): State => ({
    relevantPlotSearch: getPlotSearchFromFavourites(state),
    isFetchingPlotSearches: state.plotSearch.isFetchingPlotSearches,
    isFetchingFormAttributes: state.application.isFetchingFormAttributes,
    isPerformingFileOperation: state.application.isPerformingFileOperation,
    isTargetsPagePristine: isPristine(APPLICATION_FORM_NAME)(
      state,
      `sections.${TARGET_SECTION_IDENTIFIER}`,
    ),
    isFormValid: isValid(APPLICATION_FORM_NAME)(state),
  }),
  {
    openLoginModal,
    fetchPendingUploads,
  },
)(ApplicationPage);
