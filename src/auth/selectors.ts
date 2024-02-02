import { Selector } from 'react-redux';
import type { User } from 'oidc-client-ts';
import { RootState } from '../root/rootReducer';

export const getApiToken: Selector<RootState, string | null> = (
  state: RootState,
): string | null => state.auth.apiToken;

export const getIdentityToken: Selector<RootState, string | null> = (
  state: RootState,
): string | null => state.oidc.user?.id_token || null;

export const getAccessToken: Selector<RootState, string | null> = (
  state: RootState,
): string | null => state.oidc.user?.access_token || null;

export const getUser: Selector<RootState, User | null> = (
  state: RootState,
): User | null => state.oidc.user || null;

export const hasApiToken: Selector<RootState, boolean> = (
  state: RootState,
): boolean => !!state.auth.apiToken;

export const getIsLoadingUser: Selector<RootState, boolean> = (
  state: RootState,
): boolean => state.oidc.isLoadingUser;

export const getIsFetchingApiToken: Selector<RootState, boolean> = (
  state: RootState,
): boolean => state.auth.isFetching;
