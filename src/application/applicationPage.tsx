import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Col, Container, Row } from 'react-grid-system';
import { Button, Notification } from 'hds-react';
import { useNavigate } from 'react-router-dom';

import { Favourite } from '../favourites/types';
import { RootState } from '../root/rootReducer';
import { PlotSearch } from '../plotSearch/types';
import { fetchPlotSearches } from '../plotSearch/actions';
import {
  fetchFormAttributes,
  fetchPendingUploads,
  resetLastApplicationSubmissionError,
  submitApplication,
} from './actions';
import ApplicationForm from './components/applicationForm';
import BlockLoader from '../loader/blockLoader';
import ScreenReaderText from '../a11y/ScreenReaderText';
import AuthDependentContent from '../auth/components/authDependentContent';
import { openLoginModal } from '../login/actions';
import { ApplicationSubmission } from './types';
import { prepareApplicationForSubmission } from './helpers';
import { getPlotSearchFromFavourites } from '../favourites/helpers';
import { AppRoutes, getRouteById } from '../root/routes';

interface State {
  favourite: Favourite;
  relevantPlotSearch: PlotSearch | null;
  isFetchingFormAttributes: boolean;
  isFetchingPlotSearches: boolean;
  submittedAnswerId: number;
  isSubmitting: boolean;
  isPerformingFileOperation: boolean;
  lastError: unknown;
}

interface Props {
  favourite: Favourite;
  relevantPlotSearch: PlotSearch | null;
  fetchPlotSearches: () => void;
  fetchFormAttributes: () => void;
  isFetchingFormAttributes: boolean;
  isFetchingPlotSearches: boolean;
  openLoginModal: () => void;
  submitApplication: (data: ApplicationSubmission) => void;
  submittedAnswerId: number;
  isSubmitting: boolean;
  isPerformingFileOperation: boolean;
  lastError: unknown;
  resetLastApplicationSubmissionError: () => void;
  fetchPendingUploads: () => void;
}

const ApplicationPage = ({
  favourite,
  relevantPlotSearch,
  fetchPlotSearches,
  fetchFormAttributes,
  isFetchingFormAttributes,
  isFetchingPlotSearches,
  openLoginModal,
  submitApplication,
  submittedAnswerId,
  isSubmitting,
  isPerformingFileOperation,
  lastError,
  resetLastApplicationSubmissionError,
  fetchPendingUploads,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [previousAnswerId] = useState<number>(submittedAnswerId);

  useEffect(() => {
    fetchPlotSearches();
    fetchFormAttributes();
    resetLastApplicationSubmissionError();
  }, []);

  useEffect(() => {
    if (submittedAnswerId !== previousAnswerId) {
      navigate(getRouteById(AppRoutes.APPLICATION_SUBMIT));
    }
  }, [submittedAnswerId]);

  const submit = () => submitApplication(prepareApplicationForSubmission());

  return (
    <AuthDependentContent>
      {(loading, loggedIn) => {
        useEffect(() => {
          if (loggedIn) {
            fetchPendingUploads();
          }
        }, [loggedIn]);

        return (
          <div className="ApplicationPage">
            <Container>
              <h1>{t('application.heading', 'Plot application')}</h1>

              <div>
                <ScreenReaderText>
                  <h2>
                    {t(
                      'application.targets.screenReaderHeading',
                      'Selected plots:'
                    )}
                  </h2>
                </ScreenReaderText>
                <Row
                  component="ul"
                  className="ApplicationPage__target-list"
                  gutterWidth={48}
                >
                  {favourite.targets.map((target) => (
                    <Col
                      component="li"
                      xs={12}
                      sm={12}
                      md={6}
                      lg={4}
                      xl={4}
                      key={target.plot_search_target.id}
                    >
                      <div className="ApplicationPage__target-address">
                        {target.plot_search_target.lease_address.address},{' '}
                        {target.plot_search_target.district}
                      </div>
                      <div className="ApplicationPage__target-identifier">
                        <span className="ApplicationPage__target-identifier-text">
                          {t('application.targets.identifier', 'Plot')}{' '}
                        </span>
                        {target.plot_search_target.lease_identifier}
                      </div>
                    </Col>
                  ))}
                </Row>
              </div>
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
                            <Col xs={12}>
                              <Button
                                variant="primary"
                                onClick={submit}
                                isLoading={isSubmitting}
                                loadingText={t(
                                  'application.submitInProcess',
                                  'Submitting...'
                                )}
                                disabled={isPerformingFileOperation}
                                className="ApplicationPage__submission-button"
                              >
                                {t('application.submit', 'Submit application')}
                              </Button>
                              {lastError && (
                                <Notification
                                  size="small"
                                  type="error"
                                  label={t(
                                    'application.error.label',
                                    'Submission error'
                                  )}
                                >
                                  {t(
                                    'application.error.generic',
                                    'The application could not be submitted correctly. Please try again later.'
                                  )}
                                </Notification>
                              )}
                            </Col>
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
          </div>
        );
      }}
    </AuthDependentContent>
  );
};

export default connect(
  (state: RootState): State => ({
    favourite: state.favourite.favourite,
    relevantPlotSearch: getPlotSearchFromFavourites(state),
    isFetchingPlotSearches: state.plotSearch.isFetchingPlotSearches,
    isFetchingFormAttributes: state.application.isFetchingFormAttributes,
    submittedAnswerId: state.application.submittedAnswerId,
    isSubmitting: state.application.isSubmittingApplication,
    lastError: state.application.lastError,
    isPerformingFileOperation: state.application.isPerformingFileOperation,
  }),
  {
    fetchPlotSearches,
    fetchFormAttributes,
    openLoginModal,
    submitApplication,
    resetLastApplicationSubmissionError,
    fetchPendingUploads,
  }
)(ApplicationPage);
