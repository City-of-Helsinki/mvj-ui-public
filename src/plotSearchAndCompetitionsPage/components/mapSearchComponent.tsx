import React, { ChangeEvent, ReactNode } from 'react';
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
import { PlotSearch } from '../../plotSearch/types';
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
              <h2 className="MapSearchComponent__plot-search-subtype-heading">
                Alatyyppi (todo)
              </h2>
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
                <Col xs={2}>{translations[currentLanguage].HEADING_AREA}</Col>
                <Col xs={1} />
              </Row>
              <div role="list">
                {item.plotSearches.map((plotSearch) => (
                  <div key={plotSearch.id} role="listitem">
                    <h3 className="MapSearchComponent__plot-search-heading">
                      {plotSearch.name}
                    </h3>
                    <div role="list">
                      {plotSearch.plot_search_targets.map((target) => (
                        <Row
                          className="MapSearchComponent__target"
                          key={target.id}
                          role="listitem"
                          gutterWidth={SIDEBAR_GUTTER_WIDTH}
                        >
                          <Col xs={2}>{target.lease_identifier}</Col>
                          <Col
                            xs={3}
                            className="MapSearchComponent__target-address"
                          >
                            {target.lease_address.address}
                          </Col>
                          <Col xs={2}>
                            {target.plan_unit.plan_unit_intended_use || '?'}
                          </Col>
                          <Col xs={2}>?</Col>
                          <Col xs={2}>
                            {target.plan_unit.area?.toLocaleString(
                              currentLanguage
                            ) || '?'}
                          </Col>
                          <Col xs={1}>
                            <IconButton
                              onClick={() =>
                                setSelectedTarget({
                                  target,
                                  plotSearch,
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
