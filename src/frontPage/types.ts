export const FETCH_UI_DATA = 'frontPage/FETCH_UI_DATA';
export const UI_DATA_NOT_FOUND = 'frontPage/UI_DATA_NOT_FOUND';
export const FETCH_UI_DATA_ERROR = 'frontPage/FETCH_UI_DATA_ERROR';
export const RECEIVE_UI_DATA = 'frontPage/RECEIVE_UI_DATA';

export interface UiData {
  plot_search: number;
  other_search: number;
}

export interface ReceiveUiDataAction {
  type: typeof RECEIVE_UI_DATA;
  payload: UiData;
}
