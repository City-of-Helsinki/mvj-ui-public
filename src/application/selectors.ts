import { FieldTypeMapping } from './types';
import { RootState } from '../root/rootReducer';

export const getFieldTypeMapping = (state: RootState): FieldTypeMapping =>
  state.application.fieldTypeMapping;
