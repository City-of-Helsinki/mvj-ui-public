import { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { Col, Container, Row } from 'react-grid-system';
import { Trans, useTranslation } from 'react-i18next';
import { Notification, Link, Button } from 'hds-react';
import { useNavigate } from 'react-router-dom';
import type { User } from 'oidc-client-ts';
import { Helmet } from 'react-helmet';

import { Favourite } from '../favourites/types';
import { RootState } from '../root/rootReducer';
import { removeFavouriteTarget } from '../favourites/actions';
import FavouriteCard from './components/favouriteCard';
import { PlotSearch } from '../plotSearch/types';
import { fetchPlotSearches } from '../plotSearch/actions';
import BlockLoader from '../loader/blockLoader';
import { getRouteById, getPageTitle, AppRoutes } from '../root/helpers';
import { getIsLoadingUser, getUser } from '../auth/selectors';
import { openLoginModal } from '../login/actions';
import { getPageForCurrentPlotSearch } from '../plotSearch/helpers';
import MainContentElement from '../a11y/MainContentElement';

interface State {
  favourite: Favourite;
  plotSearches: PlotSearch[];
  isFetchingPlotSearches: boolean;
  user: User | null;
  isLoadingUser: boolean;
  searchPageLink: string | null;
}

interface Props {
  plotSearches: PlotSearch[];
  favourite: Favourite;
  removeFavouriteTarget: (id: number) => void;
  fetchPlotSearches: () => void;
  isFetchingPlotSearches: boolean;
  user: User | null;
  isLoadingUser: boolean;
  openLoginModal: () => void;
  searchPageLink: string | null;
}

const FavouritesPage = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const handleTargetRemove = (id: number): void => {
    props.removeFavouriteTarget(id);
  };

  const navigateToApplication = () => {
    if (props.user) {
      navigate(getRouteById(AppRoutes.APPLICATION_FORM));
    } else {
      props.openLoginModal();
    }
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
        (plotSearch) =>
          plotSearch.id === props.favourite.targets[0].plot_search,
      )[0],
    );
  }, [props.favourite]);

  return (
    <MainContentElement className="FavouritesPage">
      <Helmet>
        <title>
          {getPageTitle(t('favouritesPage.pageTitle', 'Selected plots'))}
        </title>
      </Helmet>
      <Container>
        <Row>
          <Col xs={12}>
            {props.favourite.targets.length > 0 && (
              <h1>
                {t(
                  'favouritesPage.title',
                  'You are applying for the following plot searches',
                )}
              </h1>
            )}
          </Col>
        </Row>
        {props.isFetchingPlotSearches ? (
          <Row>
            <Col xs={12}>
              <BlockLoader />
            </Col>
          </Row>
        ) : (
          <>
            <Row>
              {props.favourite.targets.map((target) => (
                <Col xs={12} key={target.plot_search_target.id}>
                  <FavouriteCard
                    plotSearch={plotSearch}
                    target={target.plot_search_target}
                    remove={handleTargetRemove}
                  />
                </Col>
              ))}
            </Row>
            <Row>
              <Col
                md={6}
                xs={12}
                className="FavouritesPage__notification-container"
              >
                {props.searchPageLink && (
                  <Notification
                    type="info"
                    position="inline"
                    label={t(
                      'favouritesPage.notification.title',
                      'Do you want to search for more targets?',
                    )}
                  >
                    <Trans i18nKey="favouritesPage.notification.body">
                      <p>
                        You can find all the selected targets here. You can
                        return to plot search page to add more targets.
                      </p>
                    </Trans>
                    <p>
                      <Link href={props.searchPageLink} size="M">
                        {t(
                          'favouritesPage.notification.link',
                          'Return to plot search page',
                        )}
                      </Link>
                    </p>
                  </Notification>
                )}
              </Col>
            </Row>
            <Row className="FavouritesPage__actions">
              <Col xs={12}>
                <Button
                  onClick={() => navigateToApplication()}
                  disabled={props.isLoadingUser}
                >
                  {t('favouritesPage.nextButton', 'Apply for these plots')}
                </Button>
              </Col>
            </Row>
          </>
        )}
      </Container>
    </MainContentElement>
  );
};

const mapStateToProps = (state: RootState): State => ({
  favourite: state.favourite.favourite,
  plotSearches: state.plotSearch.plotSearches,
  isFetchingPlotSearches: state.plotSearch.isFetchingPlotSearches,
  user: getUser(state),
  isLoadingUser: getIsLoadingUser(state),
  searchPageLink: getPageForCurrentPlotSearch(state),
});

export default connect(mapStateToProps, {
  fetchPlotSearches,
  removeFavouriteTarget,
  openLoginModal,
})(FavouritesPage);
