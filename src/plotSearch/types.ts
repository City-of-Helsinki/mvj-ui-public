import { ApiAttributes } from '../api/types';

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
  payload: {
    params: ApiAttributes;
  };
}

export const PLOT_SEARCH_ATTRIBUTES_NOT_FOUND =
  'plotSearch/PLOT_SEARCH_ATTRIBUTES_NOT_FOUND';
export interface PlotSearchAttributesNotFoundAction {
  type: typeof PLOT_SEARCH_ATTRIBUTES_NOT_FOUND;
}

export type PlotSearchType = {
  id: number;
  name: string;
};

export type PlotSearchSubtype = {
  id: number;
  name: string;
  plot_search_type: number;
};

export type PlotSearchStage = {
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

// TODO
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type PlotSearchTarget = {
  id: number;
  plan_unit: Record<string, never>;
  plan_unit_id: number;
  target_type: string;
  master_plan_unit_id: number;
  is_master_plan_unit_deleted: boolean;
  is_master_plan_unit_newer: boolean;
  message_label: string;
  lease_identifier: string;
  lease_address: {
    address: string;
  };
  info_links: Array<PlotSearchTargetInfoLink>;
  decisions: Array<{
    lease: number;
  }>;
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
};
export type FormField = {
  id: number;
  identifier: string;
  type: number;
  label: string;
  hint_text?: string | null;
  enabled: boolean;
  required: boolean;
  validation?: string | null;
  action?: string | null;
  sort_order: number;
  choices: Array<FormFieldChoice>;
  section_id: number;
};
export type FormFieldChoice = {
  id: number;
  text: string;
  value: string;
  action?: string | null;
  has_text_input: boolean;
};

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Decision = Record<string, any>;

export type PlotSearch = {
  id: number;
  type: PlotSearchType;
  subtype: PlotSearchSubtype;
  stage: PlotSearchStage;
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
