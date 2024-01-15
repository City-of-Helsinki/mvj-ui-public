import i18n from '../i18n';

export const logError = (e: unknown): void => {
  if (!import.meta.env.PROD) {
    // eslint-disable-next-line
    console.error(e);
  }
};

export const getPageTitle = (
  subElements?: string | Array<string | undefined>,
): string => {
  const elements = Array.isArray(subElements)
    ? [...subElements]
    : [subElements];
  elements.push(
    i18n.t('mainAppTitle', 'City of Helsinki plot and land leasing system'),
  );

  return elements.filter((item) => item).join(' | ');
};
