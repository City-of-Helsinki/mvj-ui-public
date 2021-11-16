import {
  Language,
  Translation,
} from '../language/types';

const translations: Translation = {
  [Language.FI]: {
    PLOT_SEARCH_AND_COMPETITIONS: 'Tonttihaut ja kilpailut',
    OTHER_COMPETITIONS_AND_SEARCHES: 'Muut kilpailut ja haut',
    AREA_SEARCH: 'Aluehaku',
  },
  [Language.EN]: {
    PLOT_SEARCH_AND_COMPETITIONS: 'Plot search and competitions',
    OTHER_COMPETITIONS_AND_SEARCHES: 'Other competitions and searches',
    AREA_SEARCH: 'Area search',
  },
  [Language.SWE]: {
    PLOT_SEARCH_AND_COMPETITIONS: 'Plot sökningar och tävlingar',
    OTHER_COMPETITIONS_AND_SEARCHES: 'Andra tävlingar och sökningar',
    AREA_SEARCH: 'Områdesökning',
  },
};

export default translations;