import React from 'react';
import { useTranslation } from 'react-i18next';

import Box from './components/box';

const FrontPage = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className={'container'}>
      <div className={'front-page'}>
        <div className={'banner'}>
          <h3>
            {t(
              'frontPage.bannerText',
              'City of Helsinki plot, land, area and lorem ipsum rental'
            )}
          </h3>
          <div className={'banner-koro'} />
        </div>
        <div className={'content'}>
          <h4>
            {t(
              'frontPage.contentHeader',
              'How can we help with your rental needs?'
            )}
          </h4>
          <div className={'boxes'}>
            <Box
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
              color={'pink'}
            />
            <Box
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
              color={'gray'}
            />
            <Box
              topLabel={t('frontPage.areaSearch.counter', 'Area search')}
              label={t('frontPage.areaSearch.label', 'I want to rent an area')}
              bottomText={t(
                'frontPage.areaSearch.explanation',
                'Description lorem ipsum dolor sit amet et cetera et cetera.'
              )}
              color={'yellow'}
            />
            <Box
              topLabel={t('frontPage.applyChange.counter', 'Existing leases')}
              label={t(
                'frontPage.applyChange.label',
                'I want to apply for a change for my lease'
              )}
              bottomText={t(
                'frontPage.applyChange.explanation',
                'Description lorem ipsum dolor sit amet et cetera et cetera.'
              )}
              color={'blue'}
            />
          </div>
          <h5>{t('frontPage.questions.heading', 'Questions')}</h5>
          <p>
            {t(
              'frontPage.questions.explanation',
              'Please log in and contact us through the Messages page. We will get back to you as soon as possible.'
            )}
          </p>
        </div>
      </div>
    </div>
  );
};

export default FrontPage;
