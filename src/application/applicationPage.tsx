import React, { useEffect, useRef, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Col, Container, Row } from 'react-grid-system';
import { Button, Notification } from 'hds-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import { RootState } from '../root/rootReducer';
import { PlotSearch } from '../plotSearch/types';
import { fetchPendingUploads } from './actions';
import ApplicationForm from './components/applicationForm';
import BlockLoader from '../loader/blockLoader';
import AuthDependentContent from '../auth/components/authDependentContent';
import { openLoginModal } from '../login/actions';
import { getPlotSearchFromFavourites } from '../favourites/helpers';
import { AppRoutes, getRouteById } from '../root/routes';
import ApplicationTargetList from './components/applicationTargetList';
import MainContentElement from '../a11y/MainContentElement';
import { getPageTitle } from '../root/helpers';

interface State {
  relevantPlotSearch: PlotSearch | null;
  isFetchingFormAttributes: boolean;
  isFetchingPlotSearches: boolean;
  isPerformingFileOperation: boolean;
}

interface Props {
  relevantPlotSearch: PlotSearch | null;
  isFetchingFormAttributes: boolean;
  isFetchingPlotSearches: boolean;
  openLoginModal: () => void;
  isPerformingFileOperation: boolean;
  fetchPendingUploads: () => void;
}

const ApplicationPage = ({
  relevantPlotSearch,
  isFetchingFormAttributes,
  isFetchingPlotSearches,
  openLoginModal,
  isPerformingFileOperation,
  fetchPendingUploads,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [hasVisitedTargetsTab, setHasVisitedTargetsTab] =
    useState<boolean>(false);
  const [hasDismissedTargetsAlert, setHasDismissedTargetsAlert] =
    useState<boolean>(false);

  const targetTabRef = useRef<HTMLSpanElement | null>(null);

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
                  t('application.form.pageTitle', 'Plot application')
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
                              parentTargetTabRef={targetTabRef}
                              onTargetTabVisit={() =>
                                setHasVisitedTargetsTab(true)
                              }
                            />

                            <Row className="ApplicationPage__action-buttons">
                              <Col xs={12}>
                                {!hasVisitedTargetsTab &&
                                  !!targetTabRef.current &&
                                  !hasDismissedTargetsAlert && (
                                    <Notification
                                      type="error"
                                      label={
                                        <>
                                          {t(
                                            'application.mustVisitTargetPage.title',
                                            'Attention!'
                                          )}
                                        </>
                                      }
                                      closeButtonLabelText={
                                        t(
                                          'application.mustVisitTargetPage.close',
                                          'Close'
                                        ) as string
                                      }
                                      onClose={() =>
                                        setHasDismissedTargetsAlert(true)
                                      }
                                      dismissible
                                    >
                                      {t(
                                        'application.mustVisitTargetPage.text',
                                        "You must first fill the required details for the targets you're applying to in the second tab. You can open that tab by clicking the button below."
                                      )}
                                    </Notification>
                                  )}

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
                                  onClick={() =>
                                    navigate(
                                      getRouteById(
                                        AppRoutes.APPLICATION_PREVIEW
                                      )
                                    )
                                  }
                                  disabled={
                                    isPerformingFileOperation ||
                                    (!hasVisitedTargetsTab &&
                                      !!targetTabRef.current)
                                  }
                                >
                                  {t(
                                    'application.buttons.preview',
                                    'Preview submission'
                                  )}
                                </Button>
                                {!hasVisitedTargetsTab &&
                                  !!targetTabRef.current && (
                                    <Button
                                      variant="primary"
                                      onClick={() => {
                                        if (!targetTabRef.current) {
                                          return;
                                        }

                                        // The element itself gets covered by the top navigation bar since we're not
                                        // offsetting its height, but that's perfectly fine in this case.
                                        targetTabRef.current.scrollIntoView();
                                        targetTabRef.current.click();
                                        setHasVisitedTargetsTab(true);
                                      }}
                                      disabled={isPerformingFileOperation}
                                    >
                                      {t(
                                        'application.buttons.viewTargets',
                                        'View targets'
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
                              'To submit a plot application, you have to pick plots on the plot searches page first.'
                            )}
                          </p>
                        )}
                        {relevantPlotSearch && !relevantPlotSearch.form && (
                          <p>
                            {t(
                              'application.error.noFormAvailable',
                              "No application form has been specified for the plots you have selected yet. Please be in contact and we'll look into it."
                            )}
                          </p>
                        )}
                      </>
                    ) : (
                      <>
                        <p>
                          {t(
                            'application.error.notLoggedIn',
                            'Please log in first in order to apply for plots.'
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
  }),
  {
    openLoginModal,
    fetchPendingUploads,
  }
)(ApplicationPage);
