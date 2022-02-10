import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'react-grid-system';
import { Trans, useTranslation } from 'react-i18next';
import { Notification, Link, Button } from 'hds-react';
import { useNavigate } from 'react-router-dom';

import { Favourite } from '../favourites/types';
import { RootState } from '../root/rootReducer';
import { removeFavouriteTarget } from '../favourites/actions';
import FavouriteCard from './components/favouriteCard';
import { PlotSearch } from '../plotSearch/types';
import { fetchPlotSearches } from '../plotSearch/actions';
import BlockLoader from '../loader/blockLoader';
import { AppRoutes, getRouteById } from '../root/routes';

interface State {
  favourite: Favourite;
  plotSearches: PlotSearch[];
  isFetchingPlotSearches: boolean;
}

interface Props {
  plotSearches: PlotSearch[];
  favourite: Favourite;
  removeFavouriteTarget: (id: number) => void;
  fetchPlotSearches: () => void;
  isFetchingPlotSearches: boolean;
}

const FavouritesPage = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleTargetRemove = (id: number): void => {
    props.removeFavouriteTarget(id);
  };

  const [plotSearch, setPlotSearch] = useState<PlotSearch | null>(null);

  useEffect(() => {
    props.fetchPlotSearches();
  }, []);

  useEffect(() => {
    if (props.favourite.targets.length <= 0) {
      setPlotSearch(null);
      return;
    }

    setPlotSearch(
      props.plotSearches.filter(
        (plotSearch) => plotSearch.id === props.favourite.targets[0].plot_search
      )[0]
    );
  }, [props.favourite]);

  return (
    <Container className="FavouritesPage">
      <Row>
        <Col xs={12}>
          {props.favourite.targets.length > 0 && (
            <h1>
              {t(
                'favouritesPage.title',
                'You are applying for the following plot searches'
              )}
            </h1>
          )}
        </Col>
      </Row>
      <Row>
        {props.isFetchingPlotSearches ? (
          <BlockLoader />
        ) : (
          props.favourite.targets.map((target) => (
            <Col xs={12} key={target.plot_search_target.id}>
              <FavouriteCard
                plotSearch={plotSearch}
                target={target.plot_search_target}
                remove={handleTargetRemove}
              />
            </Col>
          ))
        )}
      </Row>
      <Row>
        <Col md={6} xs={12} className="FavouritesPage__notification-container">
          <Notification
            type="info"
            position="inline"
            label={t(
              'favouritesPage.notification.title',
              'Do you want to search for more targets?'
            )}
          >
            <Trans i18nKey="favouritesPage.notification.body">
              <p>
                You can find all the selected targets here. You can return to
                plot search page to add more targets.
              </p>
            </Trans>
            <p>
              <Link
                href={getRouteById(AppRoutes.PLOT_SEARCH_AND_COMPETITIONS)}
                size="M"
              >
                {t(
                  'favouritesPage.notification.link',
                  'Return to plot search page'
                )}
              </Link>
            </p>
          </Notification>
        </Col>
      </Row>
      <Row className="FavouritesPage__actions">
        <Col xs={12}>
          <Button
            onClick={() => navigate(getRouteById(AppRoutes.APPLICATION_FORM))}
          >
            {t('favouritesPage.nextButton', 'Apply for these plots')}
          </Button>
        </Col>
      </Row>
    </Container>
  );
};

const mapStateToProps = (state: RootState): State => ({
  favourite: state.favourite.favourite,
  plotSearches: state.plotSearch.plotSearches,
  isFetchingPlotSearches: state.plotSearch.isFetchingPlotSearches,
});

export default connect(mapStateToProps, {
  fetchPlotSearches,
  removeFavouriteTarget,
})(FavouritesPage);
