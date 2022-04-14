import React from 'react';
import { Container } from 'react-grid-system';
import { useTranslation } from 'react-i18next';
import { Button } from 'hds-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import BoxGrid from '../boxGrid/boxGrid';
import BoxGridBox from '../boxGrid/boxGridBox';
import { AppRoutes, getRouteById } from '../root/routes';
import MainContentElement from '../a11y/MainContentElement';
import { getPageTitle } from '../root/helpers';

import { ReactComponent as AreaSearchImage } from '../assets/images/areaSearch/areaSearch.svg';
import { ReactComponent as OtherConstructionImage } from '../assets/images/areaSearch/otherConstruction.svg';
import { ReactComponent as PermanentFixturesImage } from '../assets/images/areaSearch/permanentFixtures.svg';
import { ReactComponent as TerracesAndParkletsImage } from '../assets/images/areaSearch/terracesAndParklets.svg';
import { ReactComponent as OutdoorEventImage } from '../assets/images/areaSearch/outdoorEvent.svg';
import { ReactComponent as CommercialUsesImage } from '../assets/images/areaSearch/commercialUses.svg';
import { ReactComponent as MiscUsesImage } from '../assets/images/areaSearch/misc.svg';

const AreaSearchLandingPage = (): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const ReadMoreButton = ({ target }: { target: string }): JSX.Element => (
    <Button
      role="link"
      variant="secondary"
      theme="black"
      onClick={() => window.open(target, '_blank')}
    >
      {t('areaSearch.landingPage.readMore', 'Read more')}
    </Button>
  );

  return (
    <MainContentElement className="AreaSearchLandingPage">
      <Helmet>
        <title>
          {getPageTitle(t('areaSearch.landingPage.pageTitle', 'Area search'))}
        </title>
      </Helmet>
      <Container>
        <h1>
          {t('areaSearch.landingPage.heading', 'Apply for a land area lease')}
        </h1>
        <p>
          {t(
            'areaSearch.landingPage.introduction',
            'The City of Helsinki offers plots and venues for rent for various types of activities. Please select the option that best represents your needs below.'
          )}
        </p>
        <h2>
          {t('areaSearch.landingPage.areaSearches.heading', 'Area search')}
        </h2>
        <BoxGrid>
          <BoxGridBox
            label={t(
              'areaSearch.landingPage.areaSearches.label',
              'Area search'
            )}
            bottomText={t(
              'areaSearch.landingPage.areaSearches.blurb',
              'You can apply for leasing any available land and water areas for temporary uses, such as for placing masts, for agricultural uses, additional courtyards, further land leasing, sand silos, collection boxes or exercising parks.'
            )}
            color="yellow"
            actions={
              <>
                <Button
                  variant="secondary"
                  theme="black"
                  onClick={() =>
                    navigate(
                      getRouteById(AppRoutes.AREA_SEARCH_APPLICATION_AREA_SPEC)
                    )
                  }
                >
                  {t(
                    'areaSearch.landingPage.applyForArea',
                    'Apply for an area'
                  )}
                </Button>
              </>
            }
            image={<AreaSearchImage />}
          />
        </BoxGrid>

        <h2>
          {t('areaSearch.landingPage.otherUses.heading', 'Other land uses')}
        </h2>
        <BoxGrid>
          <BoxGridBox
            label={t(
              'areaSearch.landingPage.otherUses.otherConstruction.label',
              'Construction on streets or in parks'
            )}
            bottomText={t(
              'areaSearch.landingPage.otherUses.otherConstruction.blurb',
              'You can apply for leasing any available land and water areas for temporary uses, such as for placing masts, for agricultural uses, additional courtyards, further land leasing, sand silos, collection boxes or exercising parks.'
            )}
            color="blue"
            actions={
              <>
                <ReadMoreButton
                  target={t(
                    'areaSearch.landingPage.otherUses.otherConstruction.link',
                    'https://www.hel.fi/helsinki/en/housing/plots-land-buildings/permits-for-public-areas/working-on-streets-and-in-parks'
                  )}
                />
              </>
            }
            image={<OtherConstructionImage />}
          />
          <BoxGridBox
            label={t(
              'areaSearch.landingPage.otherUses.permanentFixtures.label',
              'Permanent fixture installations on streets or in parks'
            )}
            bottomText={t(
              'areaSearch.landingPage.otherUses.permanentFixtures.blurb',
              'In order to place permanent fixtures such as pipes, cables, wells, building foundations, fences or walls to public areas like streets, parks and marketplaces, a permit must be acquired.'
            )}
            color="blue"
            actions={
              <>
                <ReadMoreButton
                  target={t(
                    'areaSearch.landingPage.otherUses.permanentFixtures.link',
                    'https://www.hel.fi/helsinki/en/housing/plots-land-buildings/permits-for-public-areas/working-on-streets-and-in-parks'
                  )}
                />
              </>
            }
            image={<PermanentFixturesImage />}
          />
          <BoxGridBox
            label={t(
              'areaSearch.landingPage.otherUses.terraceOrParklet.label',
              'Terraces and parklets'
            )}
            bottomText={t(
              'areaSearch.landingPage.otherUses.terraceOrParklet.blurb',
              'Setting up an outdoor serving area for a restaurant or café requires a terrace permit if the terrace is set up in a public street or park area. Setting up a glazed street terrace also requires a building or action permit. A parklet means a parking space that is temporarily re-purposed for other use.'
            )}
            color="blue"
            actions={
              <>
                <ReadMoreButton
                  target={t(
                    'areaSearch.landingPage.otherUses.terraceOrParklet.link',
                    'https://www.hel.fi/helsinki/en/housing/plots-land-buildings/permits-for-public-areas/terraces-and-parklets'
                  )}
                />
              </>
            }
            image={<TerracesAndParkletsImage />}
          />
          <BoxGridBox
            label={t(
              'areaSearch.landingPage.otherUses.outdoorEvent.label',
              'Organizing an outdoor event'
            )}
            bottomText={t(
              'areaSearch.landingPage.otherUses.outdoorEvent.blurb',
              'You need a permit to organize an event on a street, square or park if the event restricts the public use of the area. A permit is required if the event involves bringing marquee tents, tables, chairs, stages, fences or other structures to the area, for example.'
            )}
            color="blue"
            actions={
              <>
                <ReadMoreButton
                  target={t(
                    'areaSearch.landingPage.otherUses.outdoorEvent.link',
                    'https://www.hel.fi/helsinki/en/housing/plots-land-buildings/permits-for-public-areas/outdoor-events'
                  )}
                />
              </>
            }
            image={<OutdoorEventImage />}
          />
          <BoxGridBox
            label={t(
              'areaSearch.landingPage.otherUses.commercialUses.label',
              'Commercial and advertising spaces'
            )}
            bottomText={t(
              'areaSearch.landingPage.otherUses.commercialUses.blurb',
              'This includes A frames, advertising spaces on bridges, outdoor advertising devices and election advertisements.'
            )}
            color="blue"
            actions={
              <>
                <ReadMoreButton
                  target={t(
                    'areaSearch.landingPage.otherUses.commercialUses.link',
                    'https://www.hel.fi/helsinki/en/housing/plots-land-buildings/permits-for-public-areas/advertising-spots'
                  )}
                />
              </>
            }
            image={<CommercialUsesImage />}
          />
          <BoxGridBox
            label={t(
              'areaSearch.landingPage.otherUses.misc.label',
              'Other land use arrangements'
            )}
            bottomText={t(
              'areaSearch.landingPage.otherUses.misc.blurb',
              'For example city farming, dog training fields, bee farming, other land use and leasing, hunting licenses, kindergarten outdoor areas, water area leasing.'
            )}
            color="blue"
            actions={
              <>
                <ReadMoreButton
                  target={t(
                    'areaSearch.landingPage.otherUses.misc.link',
                    'https://www.hel.fi/helsinki/en/housing/plots-land-buildings/permits-for-public-areas'
                  )}
                />
              </>
            }
            image={<MiscUsesImage />}
          />
        </BoxGrid>
      </Container>
    </MainContentElement>
  );
};

export default AreaSearchLandingPage;
