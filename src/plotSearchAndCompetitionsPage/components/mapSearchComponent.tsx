import React, { ChangeEvent, Fragment, ReactNode } from 'react';
import classNames from 'classnames';
import {
  Button,
  Checkbox,
  IconAngleDown,
  IconAngleUp,
  IconArrowRight,
  useAccordion,
} from 'hds-react';
import { Row, Col, Container } from 'react-grid-system';

import translations from '../translations';
import SidePanel from '../../panel/sidePanel';
import MapSymbol from './mapSymbol';
import {
  CategoryOptions,
  CategoryVisibilities,
  SelectedTarget,
} from '../plotSearchAndCompetitionsPage';
import { PlotSearch, PlotSearchTarget } from '../../plotSearch/types';
import IconButton from '../../button/iconButton';
import { connect } from 'react-redux';
import { RootState } from '../../root/rootReducer';
import { ApiAttributes } from '../../api/types';
import { Language } from '../../language/types';

interface MapSearchComponentAccordionProps {
  initiallyOpen?: boolean;
  children?: ReactNode;
  heading: ReactNode;
  symbol?: string;
  colorIndex?: number;
  onToggleVisibility?: (isVisible: boolean) => void;
  isVisible: boolean;
}

const SIDEBAR_GUTTER_WIDTH = 5; // px

const MapSearchComponentAccordion = ({
  initiallyOpen = false,
  isVisible,
  onToggleVisibility,
  children,
  heading,
  symbol,
  colorIndex = 0,
}: MapSearchComponentAccordionProps): JSX.Element => {
  const { isOpen, buttonProps, contentProps } = useAccordion({ initiallyOpen });

  const onVisibilityChange = (e: ChangeEvent<HTMLInputElement>) => {
    if (onToggleVisibility) {
      onToggleVisibility(e.target.checked);
    }
  };

  const Icon = isOpen ? IconAngleUp : IconAngleDown;

  return (
    <div
      className={classNames('MapSearchComponent__accordion', {
        'MapSearchComponent__accordion--expanded': isOpen,
      })}
    >
      <Container className="MapSearchComponent__accordion-heading">
        <Row gutterWidth={SIDEBAR_GUTTER_WIDTH}>
          <Col xs={2}>
            <Checkbox
              checked={isVisible}
              id={symbol || ''}
              onChange={onVisibilityChange}
            />
            {symbol && <MapSymbol symbol={symbol} colorIndex={colorIndex} />}
          </Col>
          <Col
            className="MapSearchComponent__accordion-heading-toggler"
            xs={10}
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
  setSelectedTarget: (target: SelectedTarget) => void;
  selectedTarget: SelectedTarget;
  plotSearchAttributes: ApiAttributes;
  currentLanguage: Language;
}

interface State {
  plotSearchAttributes: ApiAttributes;
  currentLanguage: Language;
}

const MapSearchComponent = ({
  categoryVisibilities,
  categoryOptions,
  onToggleVisibility,
  plotSearches,
  setSelectedTarget,
  selectedTarget,
  currentLanguage,
}: MapSearchComponentProps): JSX.Element => {
  const renderSelectedTargetSidebar = () => {
    if (!selectedTarget) {
      return null;
    }
    return (
      <div className="MapSearchComponent__single-target-view">
        <Button onClick={() => setSelectedTarget(null)}>
          {translations[currentLanguage].RETURN_TO_LIST}
        </Button>
      </div>
    );
  };

  const plotSearchesByCategory = categoryOptions.map((category) => ({
    category,
    plotSearches: plotSearches?.filter(
      (plotSearch) => plotSearch.type?.id === category.id
    ),
  }));

  return (
    <SidePanel className="MapSearchComponent">
      {selectedTarget && renderSelectedTargetSidebar()}
      <div className="MapSearchComponent__list-view">
        <Row
          gutterWidth={SIDEBAR_GUTTER_WIDTH}
          className="MapSearchComponent__list-headings"
        >
          <Col xs={2}>{translations[currentLanguage].HEADING_SHOW}</Col>
          <Col xs={10}>{translations[currentLanguage].HEADING_TYPE}</Col>
        </Row>
        {plotSearchesByCategory.map((item, index) => {
          return (
            <MapSearchComponentAccordion
              heading={`${item.category.name} (${item.plotSearches.length})`}
              symbol={item.category.symbol}
              colorIndex={index}
              key={index}
              isVisible={categoryVisibilities[item.category.id] || false}
              onToggleVisibility={(isVisible: boolean) =>
                onToggleVisibility(item.category.id, isVisible)
              }
            >
              {item.category.subtypes.map((subtype) => {
                const matchingPlotSearches = item.plotSearches.filter(
                  (plotSearch) => plotSearch.subtype.id === subtype.id
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
                  const districts = matchingPlotSearches.reduce((acc, next) => {
                    next.plot_search_targets.forEach((target) => {
                      if (!acc[target.district]) {
                        acc[target.district] = {
                          heading: target.district,
                          key: target.district,
                          targets: [],
                        };
                      }

                      acc[target.district].targets.push({
                        relatedPlotSearch: next,
                        data: target,
                      });
                    });

                    return acc;
                  }, {} as Record<string, SectionSlice>);

                  const districtNames = Object.keys(districts);
                  districtNames.sort((a, b) => (a > b ? 1 : -1));

                  sections = districtNames.map(
                    (district) => districts[district]
                  );
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
                    <h3 className="MapSearchComponent__plot-search-subtype-heading">
                      {subtype.name}
                    </h3>
                    <Row
                      gutterWidth={SIDEBAR_GUTTER_WIDTH}
                      className="MapSearchComponent__list-headings"
                    >
                      <Col xs={2}>
                        {translations[currentLanguage].HEADING_PLOT_NUMBER}
                      </Col>
                      <Col xs={3}>
                        {translations[currentLanguage].HEADING_PLOT_ADDRESS}
                      </Col>
                      <Col xs={2} style={{ hyphens: 'auto' }}>
                        {translations[currentLanguage].HEADING_INTENDED_USE}
                      </Col>
                      <Col xs={2} style={{ hyphens: 'auto' }}>
                        {
                          translations[currentLanguage]
                            .HEADING_PERMITTED_BUILD_FLOOR_AREA
                        }
                      </Col>
                      <Col xs={2}>
                        {translations[currentLanguage].HEADING_AREA}
                      </Col>
                      <Col xs={1} />
                    </Row>
                    <div role="list">
                      {sections.map((section) => (
                        <div key={section.key} role="listitem">
                          <div className="MapSearchComponent__plot-search-heading">
                            <h4>{section.heading}</h4>
                            {section.headingExtra?.endDate && (
                              <span>
                                {translations[currentLanguage].HEADING_END_DATE}{' '}
                                {new Date(
                                  section.headingExtra.endDate
                                ).toLocaleString('fi', {
                                  dateStyle: 'medium',
                                  timeStyle: 'short',
                                })}
                              </span>
                            )}
                          </div>
                          <div role="list">
                            {section.targets.map((target) => (
                              <Row
                                className="MapSearchComponent__target"
                                key={target.data.id}
                                role="listitem"
                                gutterWidth={SIDEBAR_GUTTER_WIDTH}
                                align="center"
                              >
                                <Col xs={2}>{target.data.lease_identifier}</Col>
                                <Col
                                  xs={3}
                                  className="MapSearchComponent__target-address"
                                >
                                  {target.data.lease_address.address}
                                </Col>
                                <Col xs={2}>
                                  {/* TODO: actual short code instead of numeric ID */}
                                  {target.data.plan_unit
                                    .plan_unit_intended_use || '?'}
                                </Col>
                                <Col xs={2}>?</Col>
                                <Col xs={2}>
                                  {target.data.plan_unit.area?.toLocaleString(
                                    currentLanguage
                                  ) || '?'}
                                </Col>
                                <Col xs={1}>
                                  <IconButton
                                    onClick={() =>
                                      setSelectedTarget({
                                        target: target.data,
                                        plotSearch: target.relatedPlotSearch,
                                      })
                                    }
                                  >
                                    <IconArrowRight size="s" />
                                  </IconButton>
                                </Col>
                              </Row>
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
    </SidePanel>
  );
};

export default connect(
  (state: RootState): State => ({
    currentLanguage: state.language.current,
    plotSearchAttributes: state.plotSearch.plotSearchAttributes,
  })
)(MapSearchComponent);
