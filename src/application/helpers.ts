import { formValueSelector } from 'redux-form';

import { RootState } from '../root/rootReducer';
import {
  APPLICANT_MAIN_IDENTIFIERS,
  APPLICANT_SECTION_IDENTIFIER,
  ApplicantTypes,
  APPLICATION_FORM_NAME,
  ApplicationField,
  ApplicationFormFields,
  ApplicationFormNode,
  ApplicationFormRoot,
  ApplicationFormSections,
  ApplicationPreparationError,
  ApplicationSubmission,
  NestedField,
  NestedFieldLeaf,
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
      sectionRestrictions: {},
    };

    if (section.identifier === APPLICANT_SECTION_IDENTIFIER) {
      workingItem.metadata = {
        applicantType: null,
      };

      section.subsections.forEach((subsection) => {
        // always true at this point, but check required for type checking
        if (workingItem.sectionRestrictions) {
          workingItem.sectionRestrictions[subsection.identifier] =
            subsection.applicant_type || ApplicantTypes.UNKNOWN;
        }
      });
    }
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
    throw ApplicationPreparationError.MisconfiguredPlotSearch;
  }

  const attachMeta = (
    rootLevelSections: ApplicationFormSections
  ): ApplicationFormSections => {
    return Object.keys(rootLevelSections).reduce((acc, sectionName) => {
      const section = rootLevelSections[sectionName];

      switch (sectionName) {
        case APPLICANT_SECTION_IDENTIFIER: {
          const result = (section as Array<ApplicationFormNode>).map(
            (applicant) => {
              const applicantType = applicant.metadata?.applicantType as
                | ApplicantTypes
                | undefined;
              if (!applicantType) {
                throw ApplicationPreparationError.NoApplicantTypeSet;
              }

              const enabledSections = Object.keys(applicant.sections).reduce(
                (acc, sectionIdentifier) => {
                  if (
                    !(
                      [ApplicantTypes.BOTH, applicantType] as Array<
                        ApplicantTypes | undefined
                      >
                    ).includes(
                      applicant.sectionRestrictions?.[sectionIdentifier]
                    )
                  ) {
                    return acc;
                  }

                  return {
                    ...acc,
                    [sectionIdentifier]: {
                      ...applicant.sections[sectionIdentifier],
                    },
                  };
                },
                {} as ApplicationFormSections
              );

              const identifiers = APPLICANT_MAIN_IDENTIFIERS[applicantType];

              let sectionWithIdentifier =
                applicant.sections[identifiers?.DATA_SECTION];
              if (sectionWithIdentifier instanceof Array) {
                sectionWithIdentifier = sectionWithIdentifier[0];
              }
              const identifier =
                sectionWithIdentifier?.fields[identifiers?.IDENTIFIER_FIELD];

              if (!identifier?.value) {
                throw ApplicationPreparationError.NoApplicantIdentifierFound;
              }

              return {
                ...applicant,
                metadata: {
                  ...(applicant.metadata || {}),
                  identifier: identifier.value,
                },
                sections: enabledSections,
              };
            }
          );
          return {
            ...acc,
            [sectionName]: result,
          } as ApplicationFormSections;
        }
        default:
          return {
            ...acc,
            [sectionName]: section,
          };
      }
    }, {});
  };

  const purgeUIFields = (
    section: ApplicationFormSections
  ): ApplicationFormSections => {
    return Object.keys(section).reduce((acc, sectionName) => {
      const subsection = section[sectionName];
      let result: ApplicationFormNode | Array<ApplicationFormNode>;

      if (subsection instanceof Array) {
        result = subsection.map(
          ({ sections, sectionRestrictions, ...rest }) => ({
            sections: purgeUIFields(sections),
            ...rest,
          })
        );
      } else {
        const { sections, sectionRestrictions, ...rest } = subsection;
        result = {
          sections: purgeUIFields(sections),
          ...rest,
        };
      }

      return {
        ...acc,
        [sectionName]: result,
      } as ApplicationFormSections;
    }, {});
  };

  return {
    form: relevantPlotSearch.form.id,
    entries: {
      sections: purgeUIFields(attachMeta(sections)) as NestedField,
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

export const valueToApplicantType = (value: NestedFieldLeaf): string => {
  if (value === '1') {
    return ApplicantTypes.COMPANY;
  }
  if (value === '2') {
    return ApplicantTypes.PERSON;
  }

  return ApplicantTypes.UNKNOWN;
};

export const getSectionApplicantType = (
  state: RootState,
  section: FormSection,
  reduxFormPath: string
): ApplicantTypes => {
  if (section.identifier !== APPLICANT_SECTION_IDENTIFIER) {
    return ApplicantTypes.NOT_APPLICABLE;
  }

  return (
    formValueSelector(APPLICATION_FORM_NAME)(
      state,
      `${reduxFormPath}.metadata.applicantType`
    ) || ApplicantTypes.UNSELECTED
  );
};
