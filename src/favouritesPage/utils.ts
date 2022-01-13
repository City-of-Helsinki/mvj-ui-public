import { PlotSearch, PlotSearchTarget } from '../plotSearch/types';
import { renderDateTime } from '../i18n/utils';
import { TFunction } from 'i18next';

export interface Info {
  value: string | number;
  key: string;
  fullDescOnly: boolean;
}

export const getInfo = (
  target: PlotSearchTarget,
  plotSearch: PlotSearch,
  t: TFunction
): Info[] => {
  return [
    {
      value: renderDateTime(new Date(plotSearch?.end_at as string)),
      key: t('favouritesPage.targetCard.table.applyByDate', 'Apply by'),
      fullDescOnly: true,
    },
    {
      value:
        target.plan_unit.identifier !== ''
          ? target.plan_unit.identifier
          : '???',
      key: t('favouritesPage.targetCard.table.plot', 'Plot'),
      fullDescOnly: false,
    },
    {
      value:
        target.lease_address.address !== ''
          ? target.lease_address.address
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
        target.plan_unit.plan_unit_intended_use !== null
          ? target.plan_unit.plan_unit_intended_use
          : '???',
      key: t('favouritesPage.targetCard.table.intendedUsage', 'Intended use'),
      fullDescOnly: false,
    },
    {
      value:
        target.plan_unit.section_area !== null
          ? (target.plan_unit.section_area as number)
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
        target.plan_unit.area !== null
          ? (target.plan_unit.area as number)
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
