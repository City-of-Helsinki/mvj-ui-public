import { defaultLanguage } from '../i18n';

export const renderDateTime = (date: Date): string =>
  date.toLocaleString(defaultLanguage, { dateStyle: 'medium' }) +
  ', ' +
  date.toLocaleString(defaultLanguage, { timeStyle: 'short' });
