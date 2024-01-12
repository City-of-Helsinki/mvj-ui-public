import { Button, IconAngleLeft } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'react-grid-system';
import { connect } from 'react-redux';
import { useNavigate } from 'react-router-dom';

import { PlotSearch, PlotSearchTarget } from '../plotSearch/types';
import { ApiAttributes } from '../api/types';
import { SelectedTarget } from './mapSearchPage';
import { RootState } from '../root/rootReducer';
import Breadcrumbs from '../breadcrumbs/breadcrumbs';
import { defaultLanguage } from '../i18n';
import { renderDateTime } from '../i18n/utils';
import InfoLinks from './infoLinks';
import { getRouteById } from '../root/routes';
import { getTargetPlanOptionTitle } from '../plotSearch/helpers';
import { AppRoutes } from '../application/helpers';

interface State {
  plotSearchAttributes: ApiAttributes;
}

interface Props {
  plotSearchAttributes: ApiAttributes;
  selectedTarget: SelectedTarget;
  isFavourited: boolean;
  handleApplyButton: (
    target: PlotSearchTarget,
    plotSearch: PlotSearch,
    isFavourite: boolean,
  ) => void;
}

const MapSearchSingleTargetViewRow = ({
  label,
  value,
  alwaysShow = false,
}: {
  label: JSX.Element | string;
  value?: string | number | null;
  alwaysShow?: boolean;
}) => {
  if (!value && !alwaysShow) {
    return null;
  }

  return (
    <Row>
      <Col xs={6} component="dt">
        {label}
      </Col>
      <Col xs={6} component="dd">
        {value || '???'}
      </Col>
    </Row>
  );
};

const MapSearchSingleTargetView = ({
  plotSearchAttributes,
  selectedTarget,
  isFavourited,
  handleApplyButton,
}: Props) => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  if (!selectedTarget) {
    return null;
  }
  const { target, plotSearch } = selectedTarget;

  return (
    <div className="MapSearchSingleTargetView">
      <Button
        onClick={() =>
          navigate(getRouteById(AppRoutes.PLOT_SEARCH_AND_COMPETITIONS))
        }
        variant="secondary"
        size="small"
        iconLeft={<IconAngleLeft />}
      >
        {t(
          'plotSearchAndCompetitions.mapView.sidebar.singleTarget.returnToList',
          'Return to list',
        )}
      </Button>

      <Breadcrumbs
        items={[
          { label: plotSearch.type.name },
          { label: plotSearch.subtype.name },
        ]}
      />

      <h2>{plotSearch.name}</h2>
      <dl>
        <MapSearchSingleTargetViewRow
          label={t(
            'plotSearchAndCompetitions.mapView.sidebar.singleTarget.applyByDate',
            'Apply by',
          )}
          value={
            plotSearch.end_at
              ? renderDateTime(new Date(plotSearch.end_at))
              : null
          }
          alwaysShow
        />
        <MapSearchSingleTargetViewRow
          label={t(
            'plotSearchAndCompetitions.mapView.sidebar.singleTarget.plotNumber',
            'Plot',
          )}
          value={target.target_plan.identifier}
          alwaysShow
        />
        <MapSearchSingleTargetViewRow
          label={t(
            'plotSearchAndCompetitions.mapView.sidebar.singleTarget.address',
            'Address',
          )}
          value={target.target_plan.address}
          alwaysShow
        />
        <MapSearchSingleTargetViewRow
          label={t(
            'plotSearchAndCompetitions.mapView.sidebar.singleTarget.detailedPlanIdentifier',
            'Detailed plan identifier',
          )}
          value={target.target_plan.detailed_plan_identifier}
        />
        <MapSearchSingleTargetViewRow
          label={t(
            'plotSearchAndCompetitions.mapView.sidebar.singleTarget.detailedPlanState',
            'Detailed plan state',
          )}
          value={getTargetPlanOptionTitle(
            plotSearchAttributes,
            'plan_unit_state',
            target.target_plan_type,
            target.target_plan,
          )}
        />
        <MapSearchSingleTargetViewRow
          label={t(
            'plotSearchAndCompetitions.mapView.sidebar.singleTarget.intendedUse',
            'Intended use',
          )}
          value={getTargetPlanOptionTitle(
            plotSearchAttributes,
            'plan_unit_intended_use',
            target.target_plan_type,
            target.target_plan,
          )}
        />
        <MapSearchSingleTargetViewRow
          label={t(
            'plotSearchAndCompetitions.mapView.sidebar.singleTarget.permittedBuildArea',
            'Permitted build floor area (floor-m²)',
          )}
          value={target.target_plan.rent_build_permission?.toLocaleString(
            defaultLanguage,
          )}
        />
        <MapSearchSingleTargetViewRow
          label={t(
            'plotSearchAndCompetitions.mapView.sidebar.singleTarget.permittedBuildAreaResidential',
            'Permitted build residential floor area (floor-m²)',
          )}
          /*value={target.target_plan.permitted_build_floor_area_residential?.toLocaleString(defaultLanguage)}*/
          value={null}
        />
        <MapSearchSingleTargetViewRow
          label={t(
            'plotSearchAndCompetitions.mapView.sidebar.singleTarget.permittedBuildAreaCommercial',
            'Permitted build commercial floor area (floor-m²)',
          )}
          /*value={target.target_plan.permitted_build_floor_area_commercial?.toLocaleString(defaultLanguage)}*/
          value={null}
        />
        <MapSearchSingleTargetViewRow
          label={t(
            'plotSearchAndCompetitions.mapView.sidebar.singleTarget.area',
            'Area (m²)',
          )}
          value={target.target_plan.area?.toLocaleString(defaultLanguage)}
        />
        <MapSearchSingleTargetViewRow
          label={t(
            'plotSearchAndCompetitions.mapView.sidebar.singleTarget.firstSuitableConstructionYear',
            'First suitable construction year',
          )}
          /*value={target.target_plan.first_suitable_construction_year}*/
          value={null}
        />
        <MapSearchSingleTargetViewRow
          label={t(
            'plotSearchAndCompetitions.mapView.sidebar.singleTarget.hitas',
            'HITAS',
          )}
          value={target.lease_hitas}
        />
        <MapSearchSingleTargetViewRow
          label={t(
            'plotSearchAndCompetitions.mapView.sidebar.singleTarget.financingMethod',
            'Financing method',
          )}
          value={target.lease_financing}
        />
        <MapSearchSingleTargetViewRow
          label={t(
            'plotSearchAndCompetitions.mapView.sidebar.singleTarget.management',
            'Management method',
          )}
          value={target.lease_management}
        />
      </dl>
      {target.target_plan.info_links &&
        target.target_plan.info_links.length > 0 && (
          <>
            <h3>
              {t(
                'plotSearchAndCompetitions.mapView.sidebar.singleTarget.infoLinks',
                'Details',
              )}
            </h3>
            <InfoLinks target={target} />
          </>
        )}
      <Button
        className="MapSearchSingleTargetView__next-button"
        onClick={() => handleApplyButton(target, plotSearch, isFavourited)}
        variant={isFavourited ? 'secondary' : 'primary'}
      >
        {isFavourited
          ? t(
              'plotSearchAndCompetitions.mapView.sidebar.singleTarget.removeButton',
              'Remove plot from application',
            )
          : t(
              'plotSearchAndCompetitions.mapView.sidebar.singleTarget.applyButton',
              'Apply for this plot',
            )}
      </Button>
    </div>
  );
};

export default connect(
  (state: RootState): State => ({
    plotSearchAttributes: state.plotSearch.plotSearchAttributes,
  }),
)(MapSearchSingleTargetView);
