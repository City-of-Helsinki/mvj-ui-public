import { defaultLanguage } from '../i18n';

export const renderDateTime = (date: Date): string =>
  renderDate(date) + ', ' + renderTime(date);

export const renderDate = (date: Date): string =>
  date.toLocaleString(defaultLanguage, { dateStyle: 'medium' });

export const renderTime = (date: Date): string =>
  date.toLocaleString(defaultLanguage, { timeStyle: 'short' });
