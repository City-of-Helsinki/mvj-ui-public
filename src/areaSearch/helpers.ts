import {
  AREA_SEARCH_FORM_NAME,
  AreaSearchFormRoot,
  AreaSearchSubmission,
  AreaSearchApplicationSubmission,
  AreaSearchAttachment,
} from './types';
import { formValueSelector, getFormValues } from 'redux-form';
import { store } from '../index';
import { RootState } from '../root/rootReducer';
import { FormSection, FormField } from '../plotSearch/types';
import {
  ApplicantTypes,
  APPLICANT_MAIN_IDENTIFIERS,
  APPLICANT_SECTION_IDENTIFIER,
  ApplicationField,
  ApplicationFormFields,
  ApplicationFormNode,
  ApplicationFormRoot,
  ApplicationFormSections,
  ApplicationPreparationError,
  NestedField,
  SupportedFieldTypes,
  TARGET_SECTION_IDENTIFIER,
} from '../application/types';

type ApplicationFormNodeResult = {
  fields: ApplicationFormFields;
  sections?: ApplicationFormSections;
  metadata?: Record<string, unknown>;
  sectionRestrictions?: Record<string, ApplicantTypes>;
};

export const selectAttachmentIds = (state: RootState): Array<number> => {
  return state.areaSearch.areaSearchAttachments.map(
    (attachment) => attachment.id as number,
  );
};

export const initializeAreaSearchForm = (): AreaSearchFormRoot => {
  return {
    search: {
      start_date: '',
      end_date: '',
      description_area: '',
      description_intended_use: '',
      intended_use_category: null,
      intended_use: null,
      geometry: null,
      attachments: 0,
    },
    form: {
      sections: {},
      sectionTemplates: {},
      fileFieldIds: [],
      attachments: [],
    },
  };
};

export const prepareAreaSearchSubmission = (
  files: Array<number> | Array<File>,
): AreaSearchSubmission => {
  const formData = getFormValues(AREA_SEARCH_FORM_NAME)(
    store.getState(),
  ) as AreaSearchFormRoot;
  const { intended_use_category, intended_use, end_date, ...rest } =
    formData.search;

  return {
    ...rest,
    // Should already be validated to not be null at this stage
    intended_use: intended_use as number,
    area_search_attachments: files,
    end_date: end_date || null,
  };
};

export const prepareAreaSearchApplicationForSubmission = (
  formName: string,
): AreaSearchApplicationSubmission => {
  const state: RootState = store.getState();
  const sections = formValueSelector(formName)(state, 'form.sections');

  const areaSearch = state.areaSearch.lastSubmission;

  if (!areaSearch) {
    throw ApplicationPreparationError.NoAreaSearchFound;
  }

  const attachMeta = (
    rootLevelSections: ApplicationFormSections,
  ): ApplicationFormSections => {
    return Object.keys(rootLevelSections).reduce((acc, sectionName) => {
      const section = rootLevelSections[sectionName];

      switch (sectionName) {
        case APPLICANT_SECTION_IDENTIFIER: {
          const result = (
            Array.isArray(section)
              ? section
              : ([section] as Array<ApplicationFormNode>)
          ).map((applicant) => {
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
                  ).includes(applicant.sectionRestrictions?.[sectionIdentifier])
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
              {} as ApplicationFormSections,
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
          });
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
    section: ApplicationFormSections,
  ): ApplicationFormSections => {
    return Object.keys(section).reduce((acc, sectionName) => {
      const subsection = section[sectionName];
      let result: ApplicationFormNodeResult | Array<ApplicationFormNodeResult>;

      if (subsection instanceof Array) {
        result = subsection.map(
          ({ sections, sectionRestrictions, ...rest }) => {
            return sections
              ? {
                  sections: purgeUIFields(sections),
                  ...rest,
                }
              : {
                  ...rest,
                };
          },
        );
      } else {
        const { sections, sectionRestrictions, ...rest } = subsection;
        result = sections
          ? {
              sections: purgeUIFields(sections),
              ...rest,
            }
          : {
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
    form: areaSearch.form.id,
    area_search: areaSearch.id,
    entries: {
      sections: purgeUIFields(attachMeta(sections)) as NestedField,
    },
  };
};

export const getInitialAreaSearchApplicationForm = (
  state: RootState,
): ApplicationFormRoot => {
  const areaSearch = state.areaSearch.lastSubmission;
  const root: ApplicationFormRoot = {
    sections: {},
    sectionTemplates: {},
    fileFieldIds: [],
    attachments: [],
  };

  if (!areaSearch) {
    return root;
  }

  const form = areaSearch.form;

  const buildSection = (
    section: FormSection,
    parent: ApplicationFormSections = root.sections,
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
      buildSection(subsection, workingItem.sections),
    );
    section.fields.forEach((field) => buildField(field, workingItem.fields));

    if (section.add_new_allowed) {
      if (section.identifier === TARGET_SECTION_IDENTIFIER) {
        parent[section.identifier] = {
          ...workingItem,
          metadata: {
            identifier: areaSearch.id,
          },
        };
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
    parent: ApplicationFormFields,
  ): void => {
    if (!field.enabled) {
      return;
    }

    let initialValue: ApplicationField | null = null;
    switch (field.type) {
      case SupportedFieldTypes.FileUpload:
        root.fileFieldIds.push(field.id);
        initialValue = {
          value: [],
          extraValue: '',
        };
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

export const generateAttachmentLink = (
  attachment: AreaSearchAttachment,
): string => {
  return `${
    import.meta.env.REACT_APP_API_URL || ''
  }pub/area_search_attachment/${attachment.id}/download`;
};

export enum AreaSearchStepperPageIndex {
  SPECS = 0,
  APPLICATION = 1,
  PREVIEW = 2,
  SUCCESS = 3,
}

export const getCurrentDatePlaceholder = (): string => {
  const date = new Date();
  const day = String(date.getDate());
  const month = String(date.getMonth() + 1); // Month is 0-indexed
  const year = date.getFullYear();

  const currentDate = `${day}.${month}.${year}`;
  return currentDate;
};
