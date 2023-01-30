import { PlotSearch, PlotSearchTarget } from '../plotSearch/types';
import { renderDateTime } from '../i18n/utils';
import { TFunction } from 'i18next';
import { getTargetPlanOptionTitle } from '../plotSearch/helpers';
import { ApiAttributes } from '../api/types';

export interface Info {
  value: string | number | JSX.Element | JSX.Element[];
  key: string;
  fullDescOnly: boolean;
}

export const getInfo = (
  plotSearchAttributes: ApiAttributes,
  target: PlotSearchTarget,
  plotSearch: PlotSearch | null,
  t: TFunction
): Info[] => {
  let endAt = '-';
  if (plotSearch && plotSearch.end_at) {
    endAt = renderDateTime(new Date(plotSearch.end_at));
  }
  return [
    {
      value: endAt,
      key: t('favouritesPage.targetCard.table.applyByDate', 'Apply by'),
      fullDescOnly: true,
    },
    {
      value:
        target.target_plan.identifier && target.target_plan.identifier !== ''
          ? target.target_plan.identifier
          : '???',
      key: t('favouritesPage.targetCard.table.plot', 'Plot'),
      fullDescOnly: false,
    },
    {
      value:
        target.target_plan.address && target.target_plan.address !== ''
          ? target.target_plan.address
          : '???',
      key: t('favouritesPage.targetCard.table.address', 'Address'),
      fullDescOnly: true,
    },
    {
      value: '???',
      key: t(
        'favouritesPage.targetCard.table.detailedPlanIdentifier',
        'Detailed plan identifier'
      ),
      fullDescOnly: true,
    },
    {
      value: '???',
      key: t(
        'favouritesPage.targetCard.table.detailedPlanState',
        'Detailed plan state'
      ),
      fullDescOnly: true,
    },
    {
      value:
        target.target_plan.plan_unit_intended_use !== null &&
        target.target_plan.plan_unit_intended_use !== undefined
          ? getTargetPlanOptionTitle(
              plotSearchAttributes,
              'plan_unit_intended_use',
              target.target_plan_type,
              target.target_plan
            )
          : '???',
      key: t('favouritesPage.targetCard.table.intendedUsage', 'Intended use'),
      fullDescOnly: false,
    },
    {
      value:
        target.target_plan.rent_build_permission !== null
          ? (target.target_plan.rent_build_permission as number)
          : '???',
      key: t(
        'favouritesPage.targetCard.table.permittedBuildArea',
        'Permitted build floor area (floor-m²)'
      ),
      fullDescOnly: false,
    },
    {
      value: '???',
      key: t(
        'favouritesPage.targetCard.table.permittedBuildAreaResidential',
        'Permitted build residential floor area (floor-m²)'
      ),
      fullDescOnly: true,
    },
    {
      value: '???',
      key: t(
        'favouritesPage.targetCard.table.permittedBuildAreaCommercial',
        'Permitted build commercial floor area (floor-m²)'
      ),
      fullDescOnly: true,
    },
    {
      value:
        target.target_plan.area !== null
          ? (target.target_plan.area as number)
          : '???',
      key: t('favouritesPage.targetCard.table.area', 'Area (m²)'),
      fullDescOnly: false,
    },
    {
      value: '???',
      key: t(
        'favouritesPage.targetCard.table.firstSuitableConstructionYear',
        'First suitable construction year'
      ),
      fullDescOnly: true,
    },
    {
      value: '???',
      key: t('favouritesPage.targetCard.table.hitas', 'HITAS'),
      fullDescOnly: true,
    },
    {
      value: '???',
      key: t(
        'favouritesPage.targetCard.table.financingMethod',
        'Financing method'
      ),
      fullDescOnly: true,
    },
    {
      value: '???',
      key: t('favouritesPage.targetCard.table.management', 'Management method'),
      fullDescOnly: true,
    },
  ];
};
