import { Container } from 'react-grid-system';
import { useTranslation } from 'react-i18next';
import { Button } from 'hds-react';
import { useNavigate } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import BoxGrid from '../boxGrid/boxGrid';
import BoxGridBox from '../boxGrid/boxGridBox';
import { getRouteById } from '../root/routes';
import MainContentElement from '../a11y/MainContentElement';
import { getPageTitle } from '../root/helpers';

import AreaSearchImage from '../assets/images/areaSearch/areaSearch.svg?react';
import OtherConstructionImage from '../assets/images/areaSearch/otherConstruction.svg?react';
import PermanentFixturesImage from '../assets/images/areaSearch/permanentFixtures.svg?react';
import TerracesAndParkletsImage from '../assets/images/areaSearch/terracesAndParklets.svg?react';
import OutdoorEventImage from '../assets/images/areaSearch/outdoorEvent.svg?react';
import CommercialUsesImage from '../assets/images/areaSearch/commercialUses.svg?react';
import MiscUsesImage from '../assets/images/areaSearch/misc.svg?react';
import { AppRoutes } from '../application/helpers';

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
            'The City of Helsinki offers vacant land or water areas for rent for various types of activities (e.g. for placing masts, agricultural uses, additional courtyards, sand silos, collection boxes or exercising parks).',
          )}
        </p>
        <h2>
          {t('areaSearch.landingPage.areaSearches.heading', 'Area search')}
        </h2>
        <BoxGrid>
          <BoxGridBox
            label={t(
              'areaSearch.landingPage.areaSearches.label',
              'Area search',
            )}
            bottomText={
              <p>
                {t(
                  'areaSearch.landingPage.areaSearches.blurb',
                  'You can apply for leasing any available land and water areas for temporary uses, such as for placing masts, for agricultural uses, additional courtyards, further land leasing, sand silos, collection boxes or exercising parks.',
                )}
              </p>
            }
            color="yellow"
            actions={
              <>
                <Button
                  variant="secondary"
                  theme="black"
                  onClick={() =>
                    navigate(
                      getRouteById(AppRoutes.AREA_SEARCH_APPLICATION_AREA_SPEC),
                    )
                  }
                >
                  {t(
                    'areaSearch.landingPage.applyForArea',
                    'Apply for an area',
                  )}
                </Button>
              </>
            }
            image={<AreaSearchImage />}
            headerComponent="h3"
          />
        </BoxGrid>

        <h2>
          {t('areaSearch.landingPage.otherUses.heading', 'Other land uses')}
        </h2>
        <BoxGrid>
          <BoxGridBox
            label={t(
              'areaSearch.landingPage.otherUses.otherConstruction.label',
              'Construction on streets or in parks',
            )}
            bottomText={
              <p>
                {t(
                  'areaSearch.landingPage.otherUses.otherConstruction.blurb',
                  'You can apply for leasing any available land and water areas for temporary uses, such as for placing masts, for agricultural uses, additional courtyards, further land leasing, sand silos, collection boxes or exercising parks.',
                )}
              </p>
            }
            color="blue"
            actions={
              <>
                <ReadMoreButton
                  target={t(
                    'areaSearch.landingPage.otherUses.otherConstruction.link',
                    'https://www.hel.fi/helsinki/en/housing/plots-land-buildings/permits-for-public-areas/working-on-streets-and-in-parks',
                  )}
                />
              </>
            }
            image={<OtherConstructionImage />}
            headerComponent="h3"
          />
          <BoxGridBox
            label={t(
              'areaSearch.landingPage.otherUses.permanentFixtures.label',
              'Permanent fixture installations on streets or in parks',
            )}
            bottomText={
              <p>
                {t(
                  'areaSearch.landingPage.otherUses.permanentFixtures.blurb',
                  'In order to place permanent fixtures such as pipes, cables, wells, building foundations, fences or walls to public areas like streets, parks and marketplaces, a permit must be acquired.',
                )}
              </p>
            }
            color="blue"
            actions={
              <>
                <ReadMoreButton
                  target={t(
                    'areaSearch.landingPage.otherUses.permanentFixtures.link',
                    'https://www.hel.fi/helsinki/en/housing/plots-land-buildings/permits-for-public-areas/working-on-streets-and-in-parks',
                  )}
                />
              </>
            }
            image={<PermanentFixturesImage />}
            headerComponent="h3"
          />
          <BoxGridBox
            label={t(
              'areaSearch.landingPage.otherUses.terraceOrParklet.label',
              'Terraces and parklets',
            )}
            bottomText={
              <p>
                {t(
                  'areaSearch.landingPage.otherUses.terraceOrParklet.blurb',
                  'Setting up an outdoor serving area for a restaurant or café requires a terrace permit if the terrace is set up in a public street or park area. Setting up a glazed street terrace also requires a building or action permit. A parklet means a parking space that is temporarily re-purposed for other use.',
                )}
              </p>
            }
            color="blue"
            actions={
              <>
                <ReadMoreButton
                  target={t(
                    'areaSearch.landingPage.otherUses.terraceOrParklet.link',
                    'https://www.hel.fi/helsinki/en/housing/plots-land-buildings/permits-for-public-areas/terraces-and-parklets',
                  )}
                />
              </>
            }
            image={<TerracesAndParkletsImage />}
            headerComponent="h3"
          />
          <BoxGridBox
            label={t(
              'areaSearch.landingPage.otherUses.outdoorEvent.label',
              'Organizing an outdoor event',
            )}
            bottomText={
              <p>
                {t(
                  'areaSearch.landingPage.otherUses.outdoorEvent.blurb',
                  'You need a permit to organize an event on a street, square or park if the event restricts the public use of the area. A permit is required if the event involves bringing marquee tents, tables, chairs, stages, fences or other structures to the area, for example.',
                )}
              </p>
            }
            color="blue"
            actions={
              <>
                <ReadMoreButton
                  target={t(
                    'areaSearch.landingPage.otherUses.outdoorEvent.link',
                    'https://www.hel.fi/helsinki/en/housing/plots-land-buildings/permits-for-public-areas/outdoor-events',
                  )}
                />
              </>
            }
            image={<OutdoorEventImage />}
            headerComponent="h3"
          />
          <BoxGridBox
            label={t(
              'areaSearch.landingPage.otherUses.commercialUses.label',
              'Commercial and advertising spaces',
            )}
            bottomText={
              <p>
                {t(
                  'areaSearch.landingPage.otherUses.commercialUses.blurb',
                  'This includes A frames, advertising spaces on bridges, outdoor advertising devices and election advertisements.',
                )}
              </p>
            }
            color="blue"
            actions={
              <>
                <ReadMoreButton
                  target={t(
                    'areaSearch.landingPage.otherUses.commercialUses.link',
                    'https://www.hel.fi/helsinki/en/housing/plots-land-buildings/permits-for-public-areas/advertising-spots',
                  )}
                />
              </>
            }
            image={<CommercialUsesImage />}
            headerComponent="h3"
          />
          <BoxGridBox
            label={t(
              'areaSearch.landingPage.otherUses.misc.label',
              'Other land use arrangements',
            )}
            bottomText={
              <div>
                <p>
                  {t(
                    'areaSearch.landingPage.otherUses.misc.dogs.blurb',
                    'For example city farming, dog training fields, bee farming, other land use and leasing, hunting licenses, kindergarten outdoor areas, water area leasing.',
                  )}
                </p>
                <ReadMoreButton
                  target={t(
                    'areaSearch.landingPage.otherUses.misc.dogs.link',
                    'https://www.hel.fi/helsinki/en/housing/plots-land-buildings/permits-for-public-areas',
                  )}
                />
                <p>
                  {t(
                    'areaSearch.landingPage.otherUses.misc.gardening.blurb',
                    'For example city farming, dog training fields, bee farming, other land use and leasing, hunting licenses, kindergarten outdoor areas, water area leasing.',
                  )}
                </p>
              </div>
            }
            color="blue"
            actions={
              <>
                <ReadMoreButton
                  target={t(
                    'areaSearch.landingPage.otherUses.misc.gardening.link',
                    'https://www.hel.fi/helsinki/en/housing/plots-land-buildings/permits-for-public-areas',
                  )}
                />
              </>
            }
            image={<MiscUsesImage />}
            headerComponent="h3"
          />
        </BoxGrid>
      </Container>
    </MainContentElement>
  );
};

export default AreaSearchLandingPage;
