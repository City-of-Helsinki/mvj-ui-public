import { useEffect } from 'react';
import { connect } from 'react-redux';
import { Log } from 'oidc-client-ts';
import { setConfiguration as setGridSystemConfiguration } from 'react-grid-system';
import { Helmet } from 'react-helmet';

import TopNavigation from './topNavigation/topNavigation';
import Footer from './footer/footer';
import LoginModal from './login/loginModal';
import { CookieConsent } from './cookieConsent/cookieConsent';
import { RootState } from './root/rootReducer';
import { hasApiToken } from './auth/selectors';
import { fetchFavourite } from './favourites/actions';
import GlobalNotificationContainer from './globalNotification/globalNotificationContainer';
import { getIsFetchingFavourite } from './favourites/selectors';
import { getPageTitle } from './root/helpers';

// https://hds.hel.fi/design-tokens/breakpoints
// (container widths adjusted with gutters included)
// TODO: gutter width should be 12/16 in smaller sizes, but isn't configurable on a size class basis
setGridSystemConfiguration({
  breakpoints: [320, 576, 768, 992, 1248],
  containerWidths: [312, 568, 744, 968, 1224],
  gutterWidth: 24,
});

import 'hds-core';
import './main.scss';
import type { Action } from 'redux';
import {
  IS_FEATURE_OTHER_SEARCH_ENABLED,
  IS_FEATURE_PLOT_SEARCH_ENABLED,
} from './featureFlags';

interface AppProps {
  children?: JSX.Element;
  fetchFavourite: () => Action;
  isFetchingFavourite: boolean;
  hasApiToken: boolean;
}

Log.setLogger(console);

const App = ({
  children,
  fetchFavourite,
  isFetchingFavourite,
  hasApiToken,
}: AppProps): JSX.Element => {
  if (IS_FEATURE_PLOT_SEARCH_ENABLED || IS_FEATURE_OTHER_SEARCH_ENABLED) {
    useEffect(() => {
      if (!isFetchingFavourite && hasApiToken) {
        fetchFavourite();
      }
    }, [hasApiToken, fetchFavourite]);
  }

  return (
    <div className="App">
      <Helmet>
        <title>{getPageTitle()}</title>
      </Helmet>
      <LoginModal />
      <TopNavigation />
      <GlobalNotificationContainer />
      <CookieConsent />
      <main>{children}</main>
      <Footer />
    </div>
  );
};

export default connect(
  (state: RootState) => ({
    isFetchingFavourite: getIsFetchingFavourite(state),
    hasApiToken: hasApiToken(state),
  }),
  { fetchFavourite },
)(App);
