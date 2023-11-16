import { ChangeEvent, Fragment, ReactNode } from 'react';
import classNames from 'classnames';
import {
  Checkbox,
  IconAngleDown,
  IconAngleUp,
  IconArrowRight,
  IconStar,
  IconStarFill,
  Notification,
  useAccordion,
} from 'hds-react';
import { Trans, useTranslation } from 'react-i18next';
import { Row, Col, Container } from 'react-grid-system';
import { Link, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';

import SidePanel from '../panel/sidePanel';
import MapSymbol from './mapSymbol';
import {
  CategoryOptions,
  CategoryVisibilities,
  SelectedTarget,
} from './mapSearchPage';
import { PlotSearch, PlotSearchTarget } from '../plotSearch/types';
import IconButton from '../button/iconButton';
import MapSearchSingleTargetView from './mapSearchSingleTargetView';
import { AddTargetPayload, Favourite } from '../favourites/types';
import { defaultLanguage } from '../i18n';
import { renderDateTime } from '../i18n/utils';
import {
  addFavouriteTarget,
  removeFavouriteTarget,
} from '../favourites/actions';
import { AppRoutes, getRouteById } from '../root/routes';
import { RootState } from '../root/rootReducer';
import { ApiAttributes } from '../api/types';

interface MapSearchComponentAccordionProps {
  isHidden: boolean;
  initiallyOpen?: boolean;
  children?: ReactNode;
  heading: ReactNode;
  symbol?: string;
  colorIndex?: number;
  onToggleVisibility?: (isVisible: boolean) => void;
  isVisible: boolean;
  hoveredTargetId: number | null;
  setHoveredTargetId: (id: number | null) => void;
}

const SIDEBAR_GUTTER_WIDTH = 8; // px

const MapSearchComponentAccordion = ({
  isHidden,
  initiallyOpen = false,
  isVisible,
  onToggleVisibility,
  children,
  heading,
  symbol,
  colorIndex = 0,
}: MapSearchComponentAccordionProps): JSX.Element | null => {
  const { isOpen, buttonProps, contentProps } = useAccordion({ initiallyOpen });

  const onVisibilityChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onToggleVisibility) {
      onToggleVisibility(e.target.checked);
    }
  };

  const Icon = isOpen ? IconAngleUp : IconAngleDown;

  if (isHidden) {
    return null;
  }

  return (
    <div
      className={classNames('MapSearchComponent__accordion', {
        'MapSearchComponent__accordion--expanded': isOpen,
      })}
    >
      <Container className="MapSearchComponent__accordion-heading" fluid>
        <Row gutterWidth={SIDEBAR_GUTTER_WIDTH}>
          <Col xs={1.5}>
            <Checkbox
              checked={isVisible}
              id={symbol || ''}
              onChange={onVisibilityChange}
            />
            {symbol && <MapSymbol symbol={symbol} colorIndex={colorIndex} />}
          </Col>
          <Col
            className="MapSearchComponent__accordion-heading-toggler"
            xs={10.5}
            role="button"
            {...buttonProps}
          >
            <span>{heading}</span>
            <Icon size="s" aria-hidden="true" />
          </Col>
        </Row>
      </Container>
      <div className="MapSearchComponent__accordion-body" {...contentProps}>
        {children}
      </div>
    </div>
  );
};

interface MapSearchComponentProps {
  categoryOptions: CategoryOptions;
  categoryVisibilities: CategoryVisibilities;
  onToggleVisibility: (id: number, isVisible: boolean) => void;
  plotSearches: Array<PlotSearch>;
  selectedTarget: SelectedTarget;
  addFavouriteTarget: (payLoad: AddTargetPayload) => void;
  removeFavouriteTarget: (id: number) => void;
  isOpen: boolean;
  toggle: (newValue: boolean) => void;
  favourite: Favourite;
  hoveredTargetId: number | null;
  setHoveredTargetId: (id: number | null) => void;
  plotSearchAttributes: ApiAttributes | null;
}

const MapSearchComponent = ({
  categoryVisibilities,
  categoryOptions,
  onToggleVisibility,
  plotSearches,
  selectedTarget,
  addFavouriteTarget,
  removeFavouriteTarget,
  favourite,
  isOpen,
  toggle,
  hoveredTargetId,
  setHoveredTargetId,
  plotSearchAttributes,
}: MapSearchComponentProps): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const plotSearchesByCategory = categoryOptions.map((category) => ({
    category,
    plotSearches: plotSearches?.filter((plotSearch) => {
      if (plotSearch.type?.id === category.id) {
        if (favourite.targets.length <= 0) {
          return true;
        }
        return favourite.targets[0].plot_search === plotSearch.id;
      }
    }),
  }));

  const totalFilteredPlotSearches = plotSearchesByCategory.reduce(
    (acc, cat) => acc + cat.plotSearches.length,
    0,
  );

  const checkHidden = (plotSearches: PlotSearch[]): boolean => {
    if (favourite.targets.length <= 0) {
      return false;
    }

    return !plotSearches.some((s) => s.id === favourite.targets[0].plot_search);
  };

  const planUnitIntendedUses =
    plotSearchAttributes?.plot_search_targets?.child?.children?.plan_unit
      ?.children?.plan_unit_intended_use?.choices || null;
  const getIntendedUseName = (intendedUse?: number): string => {
    if (!intendedUse) {
      return '?';
    }

    if (!planUnitIntendedUses) {
      return '...';
    }

    return (
      planUnitIntendedUses.find((use) => use.value === intendedUse)
        ?.display_name || '?'
    );
  };

  const isFavourited = (
    target: PlotSearchTarget,
    favourite: Favourite,
  ): boolean => {
    return favourite.targets.some((t) => t.plot_search_target.id === target.id);
  };

  const handleApplyButton = (
    target: PlotSearchTarget,
    plotSearch: PlotSearch,
    isFavourited: boolean,
  ): void => {
    if (isFavourited) {
      removeFavouriteTarget(target.id);
      return;
    }
    const payLoad = {
      target: {
        plot_search: plotSearch.id,
        plot_search_target: target,
      },
    } as AddTargetPayload;
    addFavouriteTarget(payLoad);
  };

  const getStarIcon = (isFavoured: boolean): JSX.Element => {
    return isFavoured ? <IconStarFill size="s" /> : <IconStar size="s" />;
  };

  return (
    <SidePanel className="MapSearchComponent" isOpen={isOpen} toggle={toggle}>
      {selectedTarget && (
        <MapSearchSingleTargetView
          handleApplyButton={handleApplyButton}
          selectedTarget={selectedTarget}
          isFavourited={isFavourited(selectedTarget.target, favourite)}
        />
      )}
      <div className="MapSearchComponent__list-view">
        <Row
          gutterWidth={SIDEBAR_GUTTER_WIDTH}
          className="MapSearchComponent__list-headings"
        >
          <Col xs={1.5}>
            {t(
              'plotSearchAndCompetitions.mapView.sidebar.typeHeadings.showThisType',
              'Show',
            )}
          </Col>
          <Col xs={10.5}>
            {t(
              'plotSearchAndCompetitions.mapView.sidebar.typeHeadings.type',
              'Type',
            )}
          </Col>
        </Row>
        {plotSearchesByCategory.map((item, index) => {
          return (
            <MapSearchComponentAccordion
              isHidden={checkHidden(item.plotSearches)}
              heading={`${item.category.name} (${item.plotSearches.length})`}
              symbol={item.category.symbol}
              colorIndex={index}
              key={index}
              isVisible={categoryVisibilities[item.category.id] || false}
              onToggleVisibility={(isVisible: boolean) =>
                onToggleVisibility(item.category.id, isVisible)
              }
              hoveredTargetId={hoveredTargetId}
              setHoveredTargetId={setHoveredTargetId}
            >
              {item.category.subtypes.map((subtype) => {
                const matchingPlotSearches = item.plotSearches.filter(
                  (plotSearch) => plotSearch.subtype.id === subtype.id,
                );

                if (matchingPlotSearches.length === 0) {
                  return null;
                }

                type SectionSlice = {
                  heading: string;
                  headingExtra?: {
                    endDate?: string;
                  };
                  key: string | number;
                  targets: Array<{
                    relatedPlotSearch: PlotSearch;
                    data: PlotSearchTarget;
                  }>;
                };
                let sections: Array<SectionSlice>;

                if (subtype.show_district) {
                  const districts = matchingPlotSearches.reduce(
                    (acc, next) => {
                      next.plot_search_targets.forEach((target) => {
                        if (!acc[target.district.id]) {
                          acc[target.district.id] = {
                            heading: target.district.name,
                            key: target.district.id,
                            targets: [],
                          };
                        }

                        acc[target.district.id].targets.push({
                          relatedPlotSearch: next,
                          data: target,
                        });
                      });

                      return acc;
                    },
                    {} as Record<number, SectionSlice>,
                  );

                  sections = Object.values(districts);
                  sections.sort((a, b) => (a.heading > b.heading ? 1 : -1));
                } else {
                  sections = matchingPlotSearches.map((plotSearch) => ({
                    heading: plotSearch.name,
                    headingExtra: {
                      endDate: plotSearch.end_at,
                    },
                    key: plotSearch.id,
                    targets: plotSearch.plot_search_targets.map((target) => ({
                      relatedPlotSearch: plotSearch,
                      data: target,
                    })),
                  }));
                }

                return (
                  <Fragment key={subtype.id}>
                    <div className="MapSearchComponent__plot-search-subtype-heading">
                      <h3>{subtype.name}</h3>
                      <span>
                        <IconStar size="m" />
                        {t(
                          'plotSearchAndCompetitions.mapView.sidebar.legend.star',
                          '= add to application',
                        )}
                      </span>
                      <span>
                        <IconArrowRight size="m" />
                        {t(
                          'plotSearchAndCompetitions.mapView.sidebar.legend.arrow',
                          '= details',
                        )}
                      </span>
                    </div>
                    <div role="list">
                      {sections.map((section) => (
                        <div key={section.key} role="listitem">
                          <div className="MapSearchComponent__plot-search-heading">
                            <h4>{section.heading}</h4>
                            {section.headingExtra?.endDate && (
                              <span>
                                {t(
                                  'plotSearchAndCompetitions.mapView.sidebar.sectionApplyBy',
                                  'Apply by {{date}}',
                                  {
                                    date: renderDateTime(
                                      new Date(section.headingExtra.endDate),
                                    ),
                                  },
                                )}
                              </span>
                            )}
                          </div>
                          <Row
                            gutterWidth={SIDEBAR_GUTTER_WIDTH}
                            className="MapSearchComponent__list-headings"
                          >
                            <Col
                              xs={1.5}
                              id={`MapSearchComponentList-${section.key}-PlotNumber`}
                            >
                              {t(
                                'plotSearchAndCompetitions.mapView.sidebar.targetHeadings.plotNumber',
                                'Plot',
                              )}
                            </Col>
                            <Col
                              xs={3.5}
                              id={`MapSearchComponentList-${section.key}-Address`}
                            >
                              {t(
                                'plotSearchAndCompetitions.mapView.sidebar.targetHeadings.address',
                                'Address',
                              )}
                            </Col>
                            <Col
                              xs={3}
                              id={`MapSearchComponentList-${section.key}-IntendedUse`}
                              style={{ hyphens: 'auto' }}
                            >
                              {t(
                                'plotSearchAndCompetitions.mapView.sidebar.targetHeadings.intendedUse',
                                'Intended use',
                              )}
                            </Col>
                            <Col
                              xs={1.5}
                              id={`MapSearchComponentList-${section.key}-PermittedBuildArea`}
                              style={{ hyphens: 'auto' }}
                            >
                              {t(
                                'plotSearchAndCompetitions.mapView.sidebar.targetHeadings.permittedBuildArea',
                                'Permitted build floor area (m²)',
                              )}
                            </Col>
                            <Col
                              xs={1.5}
                              id={`MapSearchComponentList-${section.key}-Area`}
                            >
                              {t(
                                'plotSearchAndCompetitions.mapView.sidebar.targetHeadings.area',
                                'Area (m²)',
                              )}
                            </Col>
                            <Col xs={1}>
                              {t(
                                'plotSearchAndCompetitions.mapView.sidebar.targetHeadings.tools',
                                'Tools',
                              )}
                            </Col>
                          </Row>
                          <div role="list">
                            {section.targets.map((target) => (
                              <Fragment key={target.data.id}>
                                {target.data.target_type !==
                                  'direct_reservation' && (
                                  <Row
                                    onMouseEnter={() =>
                                      setHoveredTargetId(target.data.id)
                                    }
                                    onMouseLeave={() =>
                                      setHoveredTargetId(null)
                                    }
                                    className={classNames(
                                      'MapSearchComponent__target',
                                      {
                                        'MapSearchComponent__target--favourited':
                                          favourite.targets.some(
                                            (t) =>
                                              t.plot_search_target.id ===
                                              target.data.id,
                                          ),
                                      },
                                      {
                                        'MapSearchComponent__target--hover':
                                          hoveredTargetId === target.data.id,
                                      },
                                    )}
                                    key={target.data.id}
                                    role="listitem"
                                    gutterWidth={SIDEBAR_GUTTER_WIDTH}
                                    align="center"
                                  >
                                    <Col
                                      xs={1.5}
                                      aria-labelledby={`MapSearchComponentList-${section.key}-PlotNumber`}
                                    >
                                      {target.data.target_plan.identifier}
                                    </Col>
                                    <Col
                                      xs={3.5}
                                      className="MapSearchComponent__target-address"
                                      aria-labelledby={`MapSearchComponentList-${section.key}-Address`}
                                    >
                                      {target.data.target_plan.address}
                                    </Col>
                                    <Col
                                      xs={3}
                                      aria-labelledby={`MapSearchComponentList-${section.key}-IntendedUse`}
                                    >
                                      {getIntendedUseName(
                                        target.data.target_plan
                                          .plan_unit_intended_use,
                                      )}
                                    </Col>
                                    <Col
                                      xs={1.5}
                                      aria-labelledby={`MapSearchComponentList-${section.key}-PermittedBuildArea`}
                                    >
                                      {target.data.target_plan
                                        .rent_build_permission || '?'}
                                    </Col>
                                    <Col
                                      xs={1.5}
                                      aria-labelledby={`MapSearchComponentList-${section.key}-Area`}
                                    >
                                      {target.data.target_plan.area?.toLocaleString(
                                        defaultLanguage,
                                      ) || '?'}
                                    </Col>
                                    <Col
                                      xs={1}
                                      className="MapSearchComponent__target-action-buttons"
                                    >
                                      <IconButton
                                        onClick={() =>
                                          handleApplyButton(
                                            target.data,
                                            target.relatedPlotSearch,
                                            isFavourited(
                                              target.data,
                                              favourite,
                                            ),
                                          )
                                        }
                                        aria-label={t(
                                          'plotSearchAndCompetitions.mapView.sidebar.addToApplication',
                                          'Add to application',
                                        )}
                                      >
                                        {getStarIcon(
                                          isFavourited(target.data, favourite),
                                        )}
                                      </IconButton>
                                      <IconButton
                                        onClick={() =>
                                          navigate(
                                            getRouteById(
                                              AppRoutes.PLOT_SEARCH_AND_COMPETITIONS_TARGET,
                                            ) + target.data.id,
                                          )
                                        }
                                        aria-label={t(
                                          'plotSearchAndCompetitions.mapView.sidebar.navigateToTarget',
                                          'Open the details for this target',
                                        )}
                                      >
                                        <IconArrowRight size="s" />
                                      </IconButton>
                                    </Col>
                                  </Row>
                                )}
                              </Fragment>
                            ))}
                          </div>
                        </div>
                      ))}
                    </div>
                  </Fragment>
                );
              })}
            </MapSearchComponentAccordion>
          );
        })}
      </div>
      {favourite.targets.length > 0 && (
        <>
          {totalFilteredPlotSearches > 0 && (
            <div className="MapSearchComponent__notification">
              <Notification
                type="alert"
                label={
                  <>
                    {t(
                      'plotSearchAndCompetitions.mapView.sidebar.notification.singlePlotSearchAllowed.title',
                      'Attention!',
                    )}
                  </>
                }
              >
                <Trans i18nKey="plotSearchAndCompetitions.mapView.sidebar.notification.singlePlotSearchAllowed.body">
                  <p>You can only apply for one plot search per application.</p>

                  <p>
                    If one plot search contains multiple searchable targets, you
                    can add those in the same application.
                  </p>

                  <p>
                    If you want to apply for targets in another plot search, you
                    need to fill a new application for every plot search
                    separately.
                  </p>
                </Trans>
              </Notification>
            </div>
          )}
          {totalFilteredPlotSearches === 0 && (
            <div className="MapSearchComponent__notification">
              <Notification
                type="alert"
                label={
                  <>
                    {t(
                      'plotSearchAndCompetitions.mapView.sidebar.notification.selectionInAnotherTab.title',
                      'Attention!',
                    )}
                  </>
                }
              >
                <Trans i18nKey="plotSearchAndCompetitions.mapView.sidebar.notification.selectionInAnotherTab.body">
                  <p>You can only apply for one plot search per application.</p>

                  <p>
                    Your currently selected targets are of a different search
                    type than the ones shown on this page, and as a result, no
                    targets can be added on this page.{' '}
                    <Link to={getRouteById(AppRoutes.FAVOURITES)}>
                      See your currently selected targets.
                    </Link>
                  </p>
                </Trans>
              </Notification>
            </div>
          )}
        </>
      )}
      {favourite.targets.length === 0 && totalFilteredPlotSearches === 0 && (
        <div className="MapSearchComponent__notification">
          <Notification
            type="info"
            label={
              <>
                {t(
                  'plotSearchAndCompetitions.mapView.sidebar.notification.noTargetsToShow.title',
                  'Notice',
                )}
              </>
            }
          >
            <Trans i18nKey="plotSearchAndCompetitions.mapView.sidebar.notification.noTargetsToShow.body">
              <p>
                There are no searches of this type that you can apply to
                available at the moment.
              </p>
            </Trans>
          </Notification>
        </div>
      )}
    </SidePanel>
  );
};

export default connect(
  (state: RootState) => ({
    plotSearchAttributes: state.plotSearch.plotSearchAttributes,
  }),
  { addFavouriteTarget, removeFavouriteTarget },
)(MapSearchComponent);
