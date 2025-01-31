type FeatureFlag = boolean;
export const IS_FEATURE_PLOT_SEARCH_ENABLED: FeatureFlag =
  import.meta.env.VITE_FLAG_PLOT_SEARCH_ENABLED === 'true';
export const IS_FEATURE_OTHER_SEARCH_ENABLED: FeatureFlag =
  import.meta.env.VITE_FLAG_OTHER_SEARCH_ENABLED === 'true';
