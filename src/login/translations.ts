import { Language } from '../language/types';

const translations = {
  [Language.FI]: {
    LOGIN: 'Kirjaudu',
    CANCEL: 'Peruuta',
    LOGIN_TITLE: 'Hakeaksesi tontteja, ole hyvä ja kirjaudu sisään palveluun.',
  },
  [Language.EN]: {
    LOGIN: 'Login',
    CANCEL: 'Cancel',
    LOGIN_TITLE: 'To search plots, please login to the service.',
  },
  [Language.SWE]: {
    LOGIN: 'Logga in',
    CANCEL: 'Annullera',
    LOGIN_TITLE: 'Logga in på tjänsten för att ansöka om tomter.',
  },
};

export default translations;
