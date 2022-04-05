import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Col, Container, Row } from 'react-grid-system';
import { Button } from 'hds-react';
import { useNavigate } from 'react-router-dom';

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
                            />
                            <Row>
                              <Col xs={12}>
                                <Button
                                  variant="primary"
                                  onClick={() =>
                                    navigate(
                                      getRouteById(
                                        AppRoutes.APPLICATION_PREVIEW
                                      )
                                    )
                                  }
                                  disabled={isPerformingFileOperation}
                                  className="ApplicationPage__preview-button"
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
                          {t('application.loginButton', 'Log in')}
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
