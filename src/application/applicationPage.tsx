import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';
import { Col, Container, Row } from 'react-grid-system';
import { Button } from 'hds-react';

import { Favourite } from '../favourites/types';
import { RootState } from '../root/rootReducer';
import { PlotSearch } from '../plotSearch/types';
import { fetchPlotSearches } from '../plotSearch/actions';
import { fetchFormAttributes } from './actions';
import ApplicationForm from './components/applicationForm';
import BlockLoader from '../loader/blockLoader';
import ScreenReaderText from '../a11y/ScreenReaderText';
import AuthDependentContent from '../auth/components/authDependentContent';
import { openLoginModal } from '../login/actions';

interface State {
  favourite: Favourite;
  plotSearches: Array<PlotSearch>;
  isFetchingFormAttributes: boolean;
  isFetchingPlotSearches: boolean;
}

interface Props {
  favourite: Favourite;
  plotSearches: Array<PlotSearch>;
  fetchPlotSearches: () => void;
  fetchFormAttributes: () => void;
  isFetchingFormAttributes: boolean;
  isFetchingPlotSearches: boolean;
  openLoginModal: () => void;
}

const ApplicationPage = ({
  favourite,
  plotSearches,
  fetchPlotSearches,
  fetchFormAttributes,
  isFetchingFormAttributes,
  isFetchingPlotSearches,
  openLoginModal,
}: Props) => {
  const { t } = useTranslation();

  useEffect(() => {
    fetchPlotSearches();
    fetchFormAttributes();
  }, []);

  const relevantPlotSearch = plotSearches.find(
    (plotSearch) => plotSearch.id === favourite.targets[0].plot_search
  );

  return (
    <AuthDependentContent>
      {(loading, loggedIn) => {
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
                          <ApplicationForm baseForm={relevantPlotSearch.form} />
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
    plotSearches: state.plotSearch.plotSearches,
    isFetchingPlotSearches: state.plotSearch.isFetchingPlotSearches,
    isFetchingFormAttributes: state.application.isFetchingFormAttributes,
  }),
  {
    fetchPlotSearches,
    fetchFormAttributes,
    openLoginModal,
  }
)(ApplicationPage);
