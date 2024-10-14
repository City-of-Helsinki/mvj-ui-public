import { Selector } from 'react-redux';
import type { User } from 'oidc-client-ts';
import { RootState } from '../root/rootReducer';
import { apiTokenKeyName } from './constants';

export const getLoggedInUser: Selector<RootState, User | null> = (
  state: RootState,
): User | null => state.auth.user || null;

export const hasApiToken: Selector<RootState, boolean> = (
  state: RootState,
): boolean => !!state.auth.apiToken;

export const getApiToken: Selector<RootState, string> = (
  state: RootState,
): string => (state.auth.apiToken ? state.auth.apiToken[apiTokenKeyName] : '');

export const getIsRenewingApiToken: Selector<RootState, boolean> = (
  state: RootState,
): boolean => state.auth.isRenewingApiToken;
