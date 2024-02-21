import { Geometry } from 'geojson';
import { ApiAttributes } from '../api/types';
import { ApplicantTypes } from '../application/types';

export const FETCH_PLOT_SEARCHES = 'plotSearch/FETCH_PLOT_SEARCHES';
export interface FetchPlotSearchesAction {
  type: typeof FETCH_PLOT_SEARCHES;
  payload: {
    params: Record<string, string>;
  };
}

export const RECEIVE_PLOT_SEARCHES = 'plotSearch/RECEIVE_PLOT_SEARCHES';
export interface ReceivePlotSearchesAction {
  type: typeof RECEIVE_PLOT_SEARCHES;
  payload: Array<PlotSearch>;
}

export const PLOT_SEARCHES_NOT_FOUND = 'plotSearch/PLOT_SEARCHES_NOT_FOUND';
export interface PlotSearchesNotFoundAction {
  type: typeof PLOT_SEARCHES_NOT_FOUND;
}

export const FETCH_PLOT_SEARCH_ATTRIBUTES =
  'plotSearch/FETCH_PLOT_SEARCH_ATTRIBUTES';
export interface FetchPlotSearchAttributesAction {
  type: typeof FETCH_PLOT_SEARCH_ATTRIBUTES;
}

export const RECEIVE_PLOT_SEARCH_ATTRIBUTES =
  'plotSearch/RECEIVE_PLOT_SEARCH_ATTRIBUTES';
export interface ReceivePlotSearchAttributesAction {
  type: typeof RECEIVE_PLOT_SEARCH_ATTRIBUTES;
  payload: ApiAttributes;
}

export const PLOT_SEARCH_ATTRIBUTES_NOT_FOUND =
  'plotSearch/PLOT_SEARCH_ATTRIBUTES_NOT_FOUND';
export interface PlotSearchAttributesNotFoundAction {
  type: typeof PLOT_SEARCH_ATTRIBUTES_NOT_FOUND;
}

export const FETCH_PLOT_SEARCH_TYPES = 'plotSearch/FETCH_PLOT_SEARCH_TYPES';
export interface FetchPlotSearchTypesAction {
  type: typeof FETCH_PLOT_SEARCH_TYPES;
}

export const RECEIVE_PLOT_SEARCH_TYPES = 'plotSearch/RECEIVE_PLOT_SEARCH_TYPES';
export interface ReceivePlotSearchTypesAction {
  type: typeof RECEIVE_PLOT_SEARCH_TYPES;
  payload: Array<PlotSearchType>;
}

export const PLOT_SEARCH_TYPES_NOT_FOUND =
  'plotSearch/PLOT_SEARCH_TYPES_NOT_FOUND';
export interface PlotSearchTypesNotFoundAction {
  type: typeof PLOT_SEARCH_TYPES_NOT_FOUND;
}

export const FETCH_PLOT_SEARCH_STAGES = 'plotSearch/FETCH_PLOT_SEARCH_STAGES';
export interface FetchPlotSearchStagesAction {
  type: typeof FETCH_PLOT_SEARCH_STAGES;
}

export const RECEIVE_PLOT_SEARCH_STAGES =
  'plotSearch/RECEIVE_PLOT_SEARCH_STAGES';
export interface ReceivePlotSearchStagesAction {
  type: typeof RECEIVE_PLOT_SEARCH_STAGES;
  payload: Array<PlotSearchStage>;
}

export const PLOT_SEARCH_STAGES_NOT_FOUND =
  'plotSearch/PLOT_SEARCH_STAGES_NOT_FOUND';
export interface PlotSearchStagesNotFoundAction {
  type: typeof PLOT_SEARCH_STAGES_NOT_FOUND;
}

export type PlotSearchType = {
  id: number;
  name: string;
  ordering: number;
  subtypes: Array<PlotSearchSubtype>;
};

export type PlotSearchSubtype = {
  id: number;
  name: string;
  show_district: boolean;
};

export type PlotSearchStage = {
  id: number;
  name: string;
  stage: string;
};

export type PlotSearchTypeReference = {
  id: number;
  name: string;
};

export type PlotSearchSubtypeReference = {
  id: number;
  name: string;
  plot_search_type: number;
};

export type PlotSearchStageReference = {
  id: number;
  name: string;
};

export type Preparer = {
  id: number;
  username: string;
  first_name: string;
  last_name: string;
  is_staff: boolean;
};

export enum TargetPlanType {
  PlanUnit = 0,
  CustomDetailedPlan = 1,
}

export type PlotSearchTargetFromBackend = {
  id: number;
  plan_unit: PlanUnit | null;
  plan_unit_id: number | null;
  custom_detailed_plan: CustomDetailedPlan | null;
  custom_detailed_plan_id: number | null;
  target_type: string;
  master_plan_unit_id: number;
  is_master_plan_unit_deleted: boolean;
  is_master_plan_unit_newer: boolean;
  message_label: string;
  lease_identifier: string;
  lease_address: {
    address: string;
  };
  lease_hitas?: string;
  lease_financing?: string;
  lease_management?: string;
  info_links: Array<PlotSearchTargetInfoLink>;
  decisions: Array<{
    lease: number;
  }>;
  district: {
    id: number;
    name: string;
    identifier: string;
    municipality: number;
  };
};

export type PlotSearchTarget = PlotSearchTargetFromBackend & {
  target_plan: TargetPlan;
  target_plan_type: TargetPlanType;
};

export type PlanUnit = {
  id: number;
  identifier: string;
  area?: number;
  section_area?: number;
  in_contract: boolean;
  is_master: boolean;
  decisions: Array<Decision>;
  plot_division_identifier: string;
  plot_division_date_of_approval: string;
  plot_division_effective_date: string;
  detailed_plan_identifier: string;
  detailed_plan_latest_processing_date?: string;
  detailed_plan_latest_processing_date_note?: string;
  plot_division_state: number;
  plan_unit_type: number;
  plan_unit_state: number;
  plan_unit_status: string;
  plan_unit_intended_use: number;
  geometry: Geometry;
};

export type CustomDetailedPlan = {
  identifier: string;
  intended_use?: { name: string; id: number };
  address: string;
  area: number;
  state?: { name: string; id: number };
  type?: { name: string; id: number };
  detailed_plan?: string;
  detailed_plan_latest_processing_date?: string;
  detailed_plan_latest_processing_date_note?: string;
  rent_build_permission: number;
  preconstruction_estimated_construction_readiness_moment?: string;
  info_links?: Array<PlotSearchTargetInfoLink>;
  usage_distributions: Array<UsageDistribution>;
  geometry: Geometry;
};

export type TargetPlan = {
  id: number;
  identifier?: string;
  area?: number;
  section_area?: number;
  in_contract?: boolean;
  is_master?: boolean;
  decisions?: Array<Decision>;
  plot_division_identifier?: string;
  plot_division_date_of_approval?: string;
  plot_division_effective_date?: string;
  detailed_plan_identifier?: string;
  detailed_plan_latest_processing_date?: string;
  detailed_plan_latest_processing_date_note?: string;
  plot_division_state?: number;
  plan_unit_type?: number;
  plan_unit_state?: number;
  plan_unit_status?: string;
  plan_unit_intended_use?: number;
  geometry: Geometry;
  address?: string;
  usage_distributions?: Array<UsageDistribution>;
  info_links?: Array<PlotSearchTargetInfoLink>;
  preconstruction_estimated_construction_readiness_moment?: string;
  rent_build_permission?: number;
};

export type UsageDistribution = {
  distribution: string;
  build_permission: string;
  note: string;
};

export type PlotSearchTargetInfoLink = {
  id: number;
  url: string;
  description: string;
  language: string;
};

export type Form = {
  id: number;
  name: string;
  title: string;
  is_template: boolean;
  sections: Array<FormSection>;
  state: string;
};
export type FormSection = {
  id: number;
  identifier: string;
  title: string;
  visible: boolean;
  sort_order: number;
  add_new_allowed: boolean;
  add_new_text?: string;
  subsections: Array<FormSection>;
  fields: Array<FormField>;
  form_id: number;
  parent_id: number | null;
  applicant_type: ApplicantTypes | null;
};
export type FormField = {
  id: number;
  identifier: string;
  type: string;
  label: string;
  hint_text?: string;
  enabled: boolean;
  required: boolean;
  validation?: string | null;
  action?: string | null;
  sort_order: number;
  choices: Array<FormFieldChoice>;
  section_id: number;
  default_value: string | boolean;
};
export type FormFieldChoice = {
  id: number;
  text: string;
  value: string;
  action?: string | null;
  has_text_input: boolean;
};

// TODO: the public endpoint version of this is incomplete.
//  This site shouldn't probably care about decisions in any case, so this might be redundant.
export type Decision = {
  lease: number;
};

export type PlotSearchFromBackend = {
  id: number;
  type: PlotSearchTypeReference;
  subtype: PlotSearchSubtypeReference;
  stage: PlotSearchStageReference;
  search_class: string;
  form: Form;
  decisions: Array<Decision>;
  preparer: Preparer;
  plot_search_targets: Array<PlotSearchTargetFromBackend>;
  created_at: string;
  modified_at?: string;
  name: string;
  begin_at?: string;
  end_at?: string;
};

export type PlotSearch = {
  id: number;
  type: PlotSearchTypeReference;
  subtype: PlotSearchSubtypeReference;
  stage: PlotSearchStageReference;
  search_class: string;
  form: Form;
  decisions: Array<Decision>;
  preparer: Preparer;
  plot_search_targets: Array<PlotSearchTarget>;
  created_at: string;
  modified_at?: string;
  name: string;
  begin_at?: string;
  end_at?: string;
};
