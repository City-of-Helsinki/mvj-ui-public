import { formValueSelector } from 'redux-form';

import { RootState } from '../root/rootReducer';
import {
  APPLICATION_FORM_NAME,
  NestedField,
  SupportedFieldTypes,
} from './types';
import { FormField, FormSection } from '../plotSearch/types';
import { getFieldTypeMapping } from './selectors';
import { store } from '../index';

export const getInitialApplicationForm = (state: RootState): NestedField => {
  if (!state.favourite.favourite?.targets[0]?.plot_search) {
    return {};
  }

  const plotSearch = state.plotSearch.plotSearches.find(
    (plotSearch) =>
      plotSearch.id === state.favourite.favourite?.targets[0]?.plot_search
  );

  if (!plotSearch) {
    return {};
  }

  const form = plotSearch.form;
  const root: {
    sections: NestedField;
    sectionTemplates: Record<string, NestedField>;
  } = {
    sections: {},
    sectionTemplates: {},
  };
  const fieldTypes = getFieldTypeMapping(state);

  const buildSection = (
    section: FormSection,
    parent: NestedField = root.sections
  ): void => {
    const workingItem = {
      sections: {},
      fields: {},
    };

    section.subsections.forEach((subsection) =>
      buildSection(subsection, workingItem.sections)
    );
    section.fields.forEach((field) => buildField(field, workingItem.fields));

    if (section.add_new_allowed) {
      parent[section.identifier] = [workingItem];
      root.sectionTemplates[section.identifier] = { ...workingItem };
    } else {
      parent[section.identifier] = workingItem;
    }
  };

  const buildField = (field: FormField, parent: NestedField): void => {
    let initialValue;
    switch (fieldTypes[field.type]) {
      case SupportedFieldTypes.FileUpload:
        // handled outside redux-form
        break;
      case SupportedFieldTypes.SelectField:
      case SupportedFieldTypes.RadioButton:
      case SupportedFieldTypes.RadioButtonInline:
        initialValue = {
          value: null,
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

export const getSectionTemplate = (identifier: string): NestedField => {
  const state = store.getState();
  const templates = formValueSelector(APPLICATION_FORM_NAME)(
    state,
    'sectionTemplates'
  );

  return templates[identifier] || {};
};
