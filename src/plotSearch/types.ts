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
export type PlotSearchTarget = Record<string, any>;
// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type Form = Record<string, any>;
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
