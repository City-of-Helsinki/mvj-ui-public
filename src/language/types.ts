export const CHANGE_LANG = 'language/CHANGE_LANG';

interface TranslationRow {
  [index: string]: string;
}

export interface Translation {
  [index: string]: TranslationRow;
}

export enum Language {
  FI = 'fi',
  EN = 'en',
  SWE = 'sv',
}
