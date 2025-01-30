import { Koros } from 'hds-react';
import { useEffect } from 'react';
import { connect } from 'react-redux';
import { useTranslation } from 'react-i18next';

import BoxGrid from '../boxGrid/boxGrid';
import BoxGridBox from '../boxGrid/boxGridBox';
import FaqAccordion from '../faq/faqAccordion';
import MainContentElement from '../a11y/MainContentElement';
import AreaSearchesImage from '../assets/images/areaSearch/areaSearch.svg?react';
import PlotSearchesImage from '../assets/images/frontPage/plotSearches.svg?react';
import OtherSearchesImage from '../assets/images/frontPage/otherSearches.svg?react';
import { getRouteById, AppRoutes } from '../root/helpers';
import { RootState } from '../root/rootReducer';
import { fetchUiData } from './actions';
import { UiData } from './types';

interface State {
  uiData: UiData;
  isFetchingUiData: boolean;
  fetchingFailed: boolean;
  uiDataNotFound: boolean;
}

interface Props {
  uiData: UiData;
  isFetchingUiData: boolean;
  fetchingFailed: boolean;
  uiDataNotFound: boolean;
  fetchUiData: () => void;
}

const FrontPage = ({
  uiData,
  isFetchingUiData,
  fetchingFailed,
  uiDataNotFound,
  fetchUiData,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  useEffect(() => {
    fetchUiData();
  }, []);

  const getTopLabelWithCount = ({
    count,
    successKey,
    successDefault,
    failedKey,
    failedDefault,
  }: {
    count: number;
    successKey: string;
    successDefault: string;
    failedKey: string;
    failedDefault: string;
  }) => {
    if (isFetchingUiData || fetchingFailed || uiDataNotFound || count <= 0) {
      // Return the label only
      return t(failedKey, failedDefault);
    }
    // Return the label with the count
    return t(successKey, successDefault, { count });
  };

  return (
    <MainContentElement className="FrontPage">
      <div className="FrontPage__banner">
        <div className="FrontPage__heading-container">
          <h1>
            {t(
              'frontPage.bannerText',
              'Renting and selling of plots, land and water areas from the City of Helsinki',
            )}
          </h1>
        </div>
        <Koros className="FrontPage__banner-koros" type="basic" />
      </div>
      <div className="FrontPage__content">
        <h2>
          {t(
            'frontPage.contentHeader',
            'How can we help with your rental needs?',
          )}
        </h2>
        <BoxGrid>
          <BoxGridBox
            topLabel={getTopLabelWithCount({
              count: uiData.plot_search,
              successKey: 'frontPage.plotSearchAndCompetitions.counter',
              successDefault: 'Plot search and competitions: {{count}}',
              failedKey: 'frontPage.plotSearchAndCompetitions.counterFailed',
              failedDefault: 'Plot search and competitions',
            })}
            label={t(
              'frontPage.plotSearchAndCompetitions.label',
              'I want to participate in a plot search or competition',
            )}
            bottomText={
              <p>
                {t(
                  'frontPage.plotSearchAndCompetitions.explanation',
                  'Plots for long-term housing or industrial activities',
                )}
              </p>
            }
            color="pink"
            image={<PlotSearchesImage />}
            url={getRouteById(AppRoutes.PLOT_SEARCH_AND_COMPETITIONS)}
            headerComponent="h3"
          />
          <BoxGridBox
            topLabel={getTopLabelWithCount({
              count: uiData.other_search,
              successKey: 'frontPage.otherCompetitionsAndSearches.counter',
              successDefault: 'Other competitions and searches: {{count}}',
              failedKey: 'frontPage.otherCompetitionsAndSearches.counterFailed',
              failedDefault: 'Other competitions and searches',
            })}
            label={t(
              'frontPage.otherCompetitionsAndSearches.label',
              'I want to participate in another area search or competition',
            )}
            bottomText={
              <p>
                {t(
                  'frontPage.otherCompetitionsAndSearches.explanation',
                  'Other ongoing area searches and competitions',
                )}
              </p>
            }
            color="gray"
            image={<OtherSearchesImage />}
            url={getRouteById(AppRoutes.OTHER_COMPETITIONS_AND_SEARCHES)}
            headerComponent="h3"
          />
          <BoxGridBox
            topLabel={t('frontPage.areaSearch.counter', 'Area search')}
            label={t('frontPage.areaSearch.label', 'I want to rent an area')}
            bottomText={
              <p>
                {t(
                  'frontPage.areaSearch.explanation',
                  'Land and water area leases',
                )}
              </p>
            }
            color="yellow"
            image={<AreaSearchesImage />}
            url={getRouteById(AppRoutes.AREA_SEARCH_LANDING)}
            headerComponent="h3"
          />
        </BoxGrid>
        <FaqAccordion />
      </div>
    </MainContentElement>
  );
};

const mapStateToProps = (state: RootState): State => ({
  uiData: state.frontPage.uiData,
  isFetchingUiData: state.frontPage.isFetchingUiData,
  fetchingFailed: state.frontPage.fetchingFailed,
  uiDataNotFound: state.frontPage.uiDataNotFound,
});

export default connect(mapStateToProps, {
  fetchUiData,
})(FrontPage);
