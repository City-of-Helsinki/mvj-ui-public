import { Koros } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

import BoxGrid from '../boxGrid/boxGrid';
import BoxGridBox from '../boxGrid/boxGridBox';
import FaqAccordion from '../faq/faqAccordion';
import MainContentElement from '../a11y/MainContentElement';
import { ReactComponent as PlotSearchesImage } from '../assets/images/frontPage/plotSearches.svg';
import { ReactComponent as OtherSearchesImage } from '../assets/images/frontPage/otherSearches.svg';
import { ReactComponent as AreaSearchesImage } from '../assets/images/areaSearch/areaSearch.svg';
import { ReactComponent as ApplyForChangesImage } from '../assets/images/frontPage/applyForChanges.svg';

const FrontPage = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <MainContentElement className="FrontPage">
      <div className="FrontPage__banner">
        <div className="FrontPage__heading-container">
          <h3>
            {t(
              'frontPage.bannerText',
              'City of Helsinki plot, land, area and lorem ipsum rental'
            )}
          </h3>
        </div>
        <Koros className="FrontPage__banner-koros" type="basic" />
      </div>
      <div className="FrontPage__content">
        <h4>
          {t(
            'frontPage.contentHeader',
            'How can we help with your rental needs?'
          )}
        </h4>
        <BoxGrid>
          <BoxGridBox
            topLabel={t(
              'frontPage.plotSearchAndCompetitions.counter',
              'Plot search and competitions: {{count}}',
              {
                count: 2,
              }
            )}
            label={t(
              'frontPage.plotSearchAndCompetitions.label',
              'I want to participate in a plot search or competition'
            )}
            bottomText={t(
              'frontPage.plotSearchAndCompetitions.explanation',
              'Plots for long-term housing or industrial activities'
            )}
            color="pink"
            image={<PlotSearchesImage />}
          />
          <BoxGridBox
            topLabel={t(
              'frontPage.otherCompetitionsAndSearches.counter',
              'Other competitions and searches: {{count}}',
              {
                count: 14,
              }
            )}
            label={t(
              'frontPage.otherCompetitionsAndSearches.label',
              'I want to participate in another area search or competition'
            )}
            bottomText={t(
              'frontPage.otherCompetitionsAndSearches.explanation',
              'Description lorem ipsum dolor sit amet et cetera et cetera.'
            )}
            color="gray"
            image={<OtherSearchesImage />}
          />
          <BoxGridBox
            topLabel={t('frontPage.areaSearch.counter', 'Area search')}
            label={t('frontPage.areaSearch.label', 'I want to rent an area')}
            bottomText={t(
              'frontPage.areaSearch.explanation',
              'Description lorem ipsum dolor sit amet et cetera et cetera.'
            )}
            color="yellow"
            image={<AreaSearchesImage />}
          />
          <BoxGridBox
            topLabel={t('frontPage.applyChange.counter', 'Existing leases')}
            label={t(
              'frontPage.applyChange.label',
              'I want to apply for a change for my lease'
            )}
            bottomText={t(
              'frontPage.applyChange.explanation',
              'Description lorem ipsum dolor sit amet et cetera et cetera.'
            )}
            color="blue"
            image={<ApplyForChangesImage />}
          />
        </BoxGrid>
        <FaqAccordion />
      </div>
    </MainContentElement>
  );
};

export default FrontPage;
