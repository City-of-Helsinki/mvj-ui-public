import { formValueSelector } from 'redux-form';

import { RootState } from '../root/rootReducer';
import {
  APPLICATION_FORM_NAME,
  ApplicationField,
  ApplicationFormFields,
  ApplicationFormNode,
  ApplicationFormRoot,
  ApplicationFormSections,
  ApplicationSubmission,
  SupportedFieldTypes,
  TARGET_SECTION_IDENTIFIER,
} from './types';
import { FormField, FormSection } from '../plotSearch/types';
import { getFieldTypeMapping } from './selectors';
import { store } from '../index';
import { getPlotSearchFromFavourites } from '../favourites/helpers';
import { FavouriteTarget } from '../favourites/types';

export const getInitialApplicationForm = (
  state: RootState
): ApplicationFormRoot => {
  const plotSearch = getPlotSearchFromFavourites(state);
  const root: ApplicationFormRoot = {
    sections: {},
    sectionTemplates: {},
    fileFieldIds: [],
  };

  if (!plotSearch) {
    return root;
  }

  const form = plotSearch.form;
  const fieldTypes = getFieldTypeMapping(state);

  const buildSection = (
    section: FormSection,
    parent: ApplicationFormSections = root.sections
  ): void => {
    if (!section.visible) {
      return;
    }

    const workingItem: ApplicationFormNode = {
      sections: {},
      fields: {},
    };

    section.subsections.forEach((subsection) =>
      buildSection(subsection, workingItem.sections)
    );
    section.fields.forEach((field) => buildField(field, workingItem.fields));

    if (section.add_new_allowed) {
      if (section.identifier === TARGET_SECTION_IDENTIFIER) {
        parent[section.identifier] =
          state.favourite.favourite.targets.map<ApplicationFormNode>(
            (target) => {
              return {
                ...workingItem,
                metadata: {
                  identifier: target.plot_search_target.id,
                },
              };
            }
          );
      } else {
        parent[section.identifier] = [workingItem];
      }
      root.sectionTemplates[section.identifier] = { ...workingItem };
    } else {
      parent[section.identifier] = workingItem;
    }
  };

  const buildField = (
    field: FormField,
    parent: ApplicationFormFields
  ): void => {
    if (!field.enabled) {
      return;
    }

    let initialValue: ApplicationField | null = null;
    switch (fieldTypes[field.type]) {
      case SupportedFieldTypes.FileUpload:
        // handled outside redux-form
        root.fileFieldIds.push(field.id);
        break;
      case SupportedFieldTypes.SelectField:
      case SupportedFieldTypes.RadioButton:
      case SupportedFieldTypes.RadioButtonInline:
        initialValue = {
          value: '', //null,
          extraValue: '',
        };
        break;
      case SupportedFieldTypes.Checkbox:
        if (field.choices) {
          initialValue = {
            value: [],
            extraValue: '',
          };
        } else {
          initialValue = {
            value: false,
            extraValue: '',
          };
        }
        break;
      case SupportedFieldTypes.TextField:
      case SupportedFieldTypes.TextArea:
      default:
        initialValue = {
          value: '',
          extraValue: '',
        };
        break;
    }

    if (initialValue) {
      parent[field.identifier] = initialValue;
    }
  };

  form.sections.forEach((section) => buildSection(section));

  return root;
};

export const getSectionTemplate = (identifier: string): ApplicationFormNode => {
  const state = store.getState();
  const templates = formValueSelector(APPLICATION_FORM_NAME)(
    state,
    'sectionTemplates'
  );

  return templates[identifier] || {};
};

export const prepareApplicationForSubmission = (): ApplicationSubmission => {
  const state: RootState = store.getState();
  const sections = formValueSelector(APPLICATION_FORM_NAME)(state, 'sections');
  const fileFieldIds = formValueSelector(APPLICATION_FORM_NAME)(
    state,
    'fileFieldIds'
  );

  const favourite = state.favourite.favourite;
  const relevantPlotSearch = getPlotSearchFromFavourites(state);

  if (!relevantPlotSearch || !relevantPlotSearch.form) {
    throw new Error(
      'Cannot submit an application to targets without an associated form!'
    );
  }

  return {
    form: relevantPlotSearch.form.id,
    entries: {
      sections,
    },
    targets: favourite.targets.map((target) => target.plot_search_target.id),
    attachments: state.application.pendingUploads
      .filter((upload) => fileFieldIds.includes(upload.field))
      .map((upload) => upload.id),
  };
};

export const getSectionFavouriteTarget = (
  id?: number
): FavouriteTarget | null => {
  if (!id) {
    return null;
  }

  const state: RootState = store.getState();
  return (
    state.favourite?.favourite?.targets?.find(
      (target) => target.plot_search_target.id === id
    ) || null
  );
};
