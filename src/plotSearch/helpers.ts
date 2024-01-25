import { getRouteById, AppRoutes } from '../root/helpers';
import { RootState } from '../root/rootReducer';
import { getPlotSearchFromFavourites } from '../favourites/helpers';
import {
  CustomDetailedPlan,
  TargetPlan,
  PlanUnit,
  PlotSearchTargetFromBackend,
  PlotSearchTarget,
  TargetPlanType,
  PlotSearch,
  PlotSearchFromBackend,
  PlotSearchTargetInfoLink,
} from './types';
import { ApiAttributeChoice, ApiAttributes } from '../api/types';

export const getPageForCurrentPlotSearch = (
  state: RootState,
): string | null => {
  const plotSearch = getPlotSearchFromFavourites(state);

  switch (plotSearch?.search_class) {
    case 'plot_search':
      return getRouteById(AppRoutes.PLOT_SEARCH_AND_COMPETITIONS);
    case 'other_search':
      return getRouteById(AppRoutes.OTHER_COMPETITIONS_AND_SEARCHES);
    default:
      return null;
  }
};

export const parseTargetPlanToCustomDetailedPlan = (
  targetPlan: TargetPlan,
): CustomDetailedPlan => {
  return {
    identifier: targetPlan.identifier || '',
    intended_use:
      { id: targetPlan.plan_unit_intended_use || 0, name: '' } || undefined,
    address: targetPlan.address || '',
    area: targetPlan.area || 0,
    state: { id: targetPlan.plan_unit_state || 0, name: '' },
    type: { id: targetPlan.plan_unit_type || 0, name: '' },
    detailed_plan: targetPlan.detailed_plan_identifier,
    detailed_plan_latest_processing_date:
      targetPlan.detailed_plan_latest_processing_date,
    detailed_plan_latest_processing_date_note:
      targetPlan.detailed_plan_latest_processing_date_note,
    rent_build_permission: targetPlan.rent_build_permission || 0,
    preconstruction_estimated_construction_readiness_moment:
      targetPlan.preconstruction_estimated_construction_readiness_moment,
    info_links: targetPlan.info_links,
    usage_distributions: targetPlan.usage_distributions || [],
    geometry: targetPlan.geometry,
  };
};

export const parseTargetPlanKeyToCustomDetailedPlanKey = (
  targetPlanKey: keyof TargetPlan,
): keyof CustomDetailedPlan => {
  const differingKeys = {
    plan_unit_intended_use: 'intended_use',
    plan_unit_area: 'area',
    plan_unit_state: 'state',
    plan_unit_type: 'type',
  };

  if (targetPlanKey in differingKeys) {
    return differingKeys[
      targetPlanKey as keyof typeof differingKeys
    ] as keyof CustomDetailedPlan;
  }

  return targetPlanKey as keyof CustomDetailedPlan;
};

export const parseCustomDetailedPlanToTargetPlan = (
  customDetailedPlanId: number,
  customDetailedPlan: CustomDetailedPlan,
): TargetPlan => {
  return {
    id: customDetailedPlanId,
    identifier: customDetailedPlan.identifier,
    area: customDetailedPlan.area,
    detailed_plan_identifier: customDetailedPlan.detailed_plan,
    detailed_plan_latest_processing_date:
      customDetailedPlan.detailed_plan_latest_processing_date,
    detailed_plan_latest_processing_date_note:
      customDetailedPlan.detailed_plan_latest_processing_date_note,
    plan_unit_type: customDetailedPlan.type?.id,
    plan_unit_state: customDetailedPlan.state?.id,
    plan_unit_intended_use: customDetailedPlan.intended_use
      ? customDetailedPlan.intended_use.id
      : undefined,
    geometry: customDetailedPlan.geometry,
    address: customDetailedPlan.address,
    usage_distributions: customDetailedPlan.usage_distributions,
    info_links: customDetailedPlan.info_links,
    preconstruction_estimated_construction_readiness_moment:
      customDetailedPlan.preconstruction_estimated_construction_readiness_moment,
    rent_build_permission: customDetailedPlan.rent_build_permission,
    section_area: undefined,
    in_contract: undefined,
    is_master: undefined,
    decisions: undefined,
    plot_division_identifier: undefined,
    plot_division_date_of_approval: undefined,
    plot_division_effective_date: undefined,
    plot_division_state: undefined,
  };
};

export const parsePlanUnitToTargetPlan = (
  planUnitId: number,
  planUnit: PlanUnit,
  address: string,
  infoLinks: Array<PlotSearchTargetInfoLink>,
): TargetPlan => {
  return {
    id: planUnitId,
    identifier: planUnit.identifier || undefined,
    area: planUnit.area,
    detailed_plan_identifier: planUnit.detailed_plan_identifier,
    detailed_plan_latest_processing_date:
      planUnit.detailed_plan_latest_processing_date,
    detailed_plan_latest_processing_date_note:
      planUnit.detailed_plan_latest_processing_date_note,
    plan_unit_type: planUnit.plan_unit_type,
    plan_unit_state: planUnit.plan_unit_state,
    plan_unit_intended_use: planUnit.plan_unit_intended_use,
    geometry: planUnit.geometry,
    address: address || undefined,
    usage_distributions: undefined,
    info_links: infoLinks || undefined,
    preconstruction_estimated_construction_readiness_moment: undefined,
    rent_build_permission: undefined,
    section_area: planUnit.section_area,
    in_contract: planUnit.in_contract,
    is_master: planUnit.is_master,
    decisions: planUnit.decisions,
    plot_division_identifier: planUnit.plot_division_identifier,
    plot_division_date_of_approval: planUnit.plot_division_date_of_approval,
    plot_division_effective_date: planUnit.plot_division_effective_date,
    plot_division_state: planUnit.plot_division_state,
  };
};

export const parseTargetPlan = (
  targetToParse: PlotSearchTargetFromBackend,
): PlotSearchTarget => {
  let targetPlan: TargetPlan;
  let targetPlanType: TargetPlanType;

  if (
    targetToParse.custom_detailed_plan_id &&
    targetToParse.custom_detailed_plan
  ) {
    const targetId = targetToParse.custom_detailed_plan_id;
    targetPlan = parseCustomDetailedPlanToTargetPlan(
      targetId,
      targetToParse.custom_detailed_plan,
    );
    targetPlanType = TargetPlanType.CustomDetailedPlan;
  } else {
    const targetId = targetToParse.plan_unit_id;

    targetPlan = parsePlanUnitToTargetPlan(
      targetId as number,
      targetToParse.plan_unit as PlanUnit,
      targetToParse.lease_address.address,
      targetToParse.info_links,
    );
    targetPlanType = TargetPlanType.PlanUnit;
  }

  return {
    ...targetToParse,
    target_plan_type: targetPlanType,
    target_plan: targetPlan,
  };
};

export const parseTargetPlans = (
  targetsToParse: Array<PlotSearchTargetFromBackend>,
): Array<PlotSearchTarget> => {
  const parsedTargets: Array<PlotSearchTarget> = [];

  targetsToParse.forEach((target) => {
    parsedTargets.push(parseTargetPlan(target));
  });

  return parsedTargets;
};

export const parsePlotSearches = (
  plotSearches: Array<PlotSearchFromBackend>,
): Array<PlotSearch> => {
  return plotSearches.map((plotSearch) => ({
    ...plotSearch,
    plot_search_targets: parseTargetPlans(plotSearch.plot_search_targets),
  }));
};

export const getPlanUnitOptionTitle = (
  attributes: ApiAttributes,
  field: keyof PlanUnit,
  planUnit: PlanUnit,
): string => {
  return (
    attributes.plot_search_targets?.child?.children?.plan_unit?.children?.[
      field
    ]?.choices?.find(
      (choice: ApiAttributeChoice) => choice.value === planUnit[field],
    )?.display_name || '???'
  );
};

export const getCustomDetailedPlanOptionTitle = (
  attributes: ApiAttributes,
  field: keyof CustomDetailedPlan,
  customDetailedPlan: CustomDetailedPlan,
): string => {
  const value =
    field === 'intended_use' || field === 'state' || field === 'type'
      ? customDetailedPlan[field]?.id
      : customDetailedPlan[field];
  return (
    attributes.plot_search_targets?.child?.children?.custom_detailed_plan?.children?.[
      field
    ]?.choices?.find((choice: ApiAttributeChoice) => choice.value === value)
      ?.display_name || '???'
  );
};

export const getTargetPlanOptionTitle = (
  attributes: ApiAttributes,
  field: keyof TargetPlan,
  targetType: TargetPlanType,
  targetPlan: TargetPlan,
): string => {
  if (targetType === TargetPlanType.PlanUnit) {
    return getPlanUnitOptionTitle(
      attributes,
      field as keyof PlanUnit,
      targetPlan as PlanUnit,
    );
  }

  return getCustomDetailedPlanOptionTitle(
    attributes,
    parseTargetPlanKeyToCustomDetailedPlanKey(field),
    parseTargetPlanToCustomDetailedPlan(targetPlan),
  );
};
