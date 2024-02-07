import { Selector } from 'react-redux';

import { RootState } from '../root/rootReducer';

export const isAreaSearchApplicationFormSetUp: Selector<RootState, boolean> = (
  state: RootState,
): boolean => state.areaSearch.areaSearchApplicationFormSetUp;
