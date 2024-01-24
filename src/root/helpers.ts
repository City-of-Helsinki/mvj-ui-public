import i18n from '../i18n';

export const AppRoutes = {
  HOME: 'home',
  ERROR: 'error',
  PLOT_SEARCH_AND_COMPETITIONS: 'plot-search-and-competitions',
  PLOT_SEARCH_AND_COMPETITIONS_TARGET: 'plot-search-and-competitions-target',
  OTHER_COMPETITIONS_AND_SEARCHES: 'other-competitions-and-searches',
  AREA_SEARCH_LANDING: 'area-search',
  AREA_SEARCH_APPLICATION_ROOT: 'area-search-application-root',
  AREA_SEARCH_APPLICATION_AREA_SPEC: 'area-search-application-area-spec',
  AREA_SEARCH_APPLICATION_FORM: 'area-search-application-form',
  AREA_SEARCH_APPLICATION_SUBMIT: 'area-search-application-submit',
  AREA_SEARCH_APPLICATION_FORM_PREVIEW: 'area-search-application-form-preview',
  LEASES: 'leases',
  APPLICATIONS: 'applications',
  MESSAGES: 'messages',
  FAVOURITES: 'favourites',
  OIDC_CALLBACK: 'oidc-callback',
  APPLICATION_ROOT: 'application-root',
  APPLICATION_FORM: 'application-form',
  APPLICATION_PREVIEW: 'application-preview',
  APPLICATION_SUBMIT: 'application-submit',
  DIRECT_RESERVATION: 'direct-reservation',
};

/**
 * Get route by id
 * @param {string} id
 * @returns {string}
 */
export const getRouteById = (id: string): string => {
  const routes = {
    [AppRoutes.HOME]: '/',
    [AppRoutes.PLOT_SEARCH_AND_COMPETITIONS]: '/tonttihaut-ja-kilpailut',
    [AppRoutes.PLOT_SEARCH_AND_COMPETITIONS_TARGET]:
      '/tonttihaut-ja-kilpailut/kohteet/',
    [AppRoutes.OTHER_COMPETITIONS_AND_SEARCHES]: '/muut-kilpailut-ja-haut',
    [AppRoutes.AREA_SEARCH_LANDING]: '/aluehaku',
    [AppRoutes.AREA_SEARCH_APPLICATION_ROOT]: '/aluehaku/hakemus',
    [AppRoutes.AREA_SEARCH_APPLICATION_AREA_SPEC]:
      '/aluehaku/hakemus/alueen-maaritys',
    [AppRoutes.AREA_SEARCH_APPLICATION_FORM]:
      '/aluehaku/hakemus/tietojen-taytto',
    [AppRoutes.AREA_SEARCH_APPLICATION_SUBMIT]: '/aluehaku/hakemus/lahetys',
    [AppRoutes.AREA_SEARCH_APPLICATION_FORM_PREVIEW]:
      '/aluehaku/hakemus/tietojen-tarkistus',
    [AppRoutes.LEASES]: '/vuokraukset',
    [AppRoutes.APPLICATIONS]: '/hakemukset',
    [AppRoutes.MESSAGES]: '/viestit',
    [AppRoutes.FAVOURITES]: '/suosikit',
    [AppRoutes.OIDC_CALLBACK]: '/oidc/callback',
    [AppRoutes.APPLICATION_ROOT]: '/hakemus',
    [AppRoutes.APPLICATION_FORM]: '/hakemus/tietojen-taytto',
    [AppRoutes.APPLICATION_PREVIEW]: '/hakemus/tietojen-tarkistus',
    [AppRoutes.APPLICATION_SUBMIT]: '/hakemus/lahetys',
    [AppRoutes.DIRECT_RESERVATION]: '/suoravaraus/',
  };

  return routes[id] ? routes[id] : '';
};

export const getPartialRouteById = (id: string, parentId: string): string => {
  const target = getRouteById(id);
  const parent = getRouteById(parentId);

  if (!target.startsWith(parent)) {
    throw new Error(
      `Invalid route nesting pattern! ${target} is not a subroute of ${parent}.`,
    );
  }

  return target.slice(parent.length);
};

export const logError = (e: unknown): void => {
  if (!import.meta.env.PROD) {
    // eslint-disable-next-line
    console.error(e);
  }
};

export const getPageTitle = (
  subElements?: string | Array<string | undefined>,
): string => {
  const elements = Array.isArray(subElements)
    ? [...subElements]
    : [subElements];
  elements.push(
    i18n.t('mainAppTitle', 'City of Helsinki plot and land leasing system'),
  );

  return elements.filter((item) => item).join(' | ');
};
