import { Language, Translation } from '../language/types';

const translations: Translation = {
  [Language.FI]: {
    MAP_SEARCH: 'Karttahaku',
    LIST: 'Lista',
    HEADING_SHOW: 'Näytä',
    HEADING_TYPE: 'Tyyppi',
    HEADING_PLOT_NUMBER: 'Tontti',
    HEADING_PLOT_ADDRESS: 'Osoite',
    HEADING_INTENDED_USE: 'Käyttö\u00adtarkoitus', // soft hyphen
    HEADING_PERMITTED_BUILD_FLOOR_AREA: 'Rakennus\u00adoik. (k-m²)',
    HEADING_AREA: 'Pinta-ala (m²)',
    RETURN_TO_LIST: 'Takaisin',
    HEADING_END_DATE: 'Hakuaika päättyy',
  },
  [Language.EN]: {
    MAP_SEARCH: 'Map search',
    LIST: 'List',
    HEADING_SHOW: 'Show',
    HEADING_TYPE: 'Type',
    HEADING_PLOT_NUMBER: 'Plot',
    HEADING_PLOT_ADDRESS: 'Address',
    HEADING_INTENDED_USE: 'Intended use',
    HEADING_PERMITTED_BUILD_FLOOR_AREA: 'Permitted build floor area (m²)',
    HEADING_AREA: 'Area (m²)',
    RETURN_TO_LIST: 'Back',
    HEADING_END_DATE: 'Apply by',
  },
  [Language.SWE]: {
    MAP_SEARCH: 'Kartsökning',
    LIST: 'Lista',
  },
};

export default translations;
