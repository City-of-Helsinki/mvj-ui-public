import { formValueSelector } from 'redux-form';

import { RootState } from '../root/rootReducer';
import {
  APPLICANT_MAIN_IDENTIFIERS,
  APPLICANT_SECTION_IDENTIFIER,
  ApplicantTypes,
  ApplicationField,
  ApplicationFormFields,
  ApplicationFormNode,
  ApplicationFormRoot,
  ApplicationFormSections,
  ApplicationPreparationError,
  ApplicationSubmission,
  FieldValue,
  NestedField,
  NestedFieldLeaf,
  SHOW_IF_FIELD_IDENTIFIER,
  SupportedFieldTypes,
  TARGET_SECTION_IDENTIFIER,
} from './types';
import { FormField, FormSection } from '../plotSearch/types';
import { store } from '../index';
import { getPlotSearchFromFavourites } from '../favourites/helpers';
import { FavouriteTarget } from '../favourites/types';
import { useTranslation } from 'react-i18next';

export const getInitialApplicationForm = (
  state: RootState,
): ApplicationFormRoot => {
  const plotSearch = getPlotSearchFromFavourites(state);
  const root: ApplicationFormRoot = {
    sections: {},
    sectionTemplates: {},
    fileFieldIds: [],
    attachments: [],
  };

  if (!plotSearch) {
    return root;
  }

  const form = plotSearch.form;

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
        parent[section.identifier] =
          state.favourite.favourite.targets.map<ApplicationFormNode>(
            (target) => {
              return {
                ...workingItem,
                metadata: {
                  identifier: target.plot_search_target.id,
                },
              };
            },
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

export const getSectionTemplate = (
  identifier: string,
  formName: string,
  path = '',
): ApplicationFormNode => {
  const state = store.getState();
  const templates = formValueSelector(formName)(
    state,
    `${path !== '' ? path + '.' : ''}sectionTemplates`,
  );

  return templates[identifier] || {};
};

export const prepareApplicationForSubmission = (
  formName: string,
): ApplicationSubmission => {
  const state: RootState = store.getState();
  const sections = formValueSelector(formName)(state, 'sections');
  const attachments = formValueSelector(formName)(state, 'attachments');

  const favourite = state.favourite.favourite;
  const relevantPlotSearch = getPlotSearchFromFavourites(state);

  if (!relevantPlotSearch || !relevantPlotSearch.form) {
    throw ApplicationPreparationError.MisconfiguredPlotSearch;
  }

  const attachMeta = (
    rootLevelSections: ApplicationFormSections,
  ): ApplicationFormSections => {
    return Object.keys(rootLevelSections).reduce((acc, sectionName) => {
      const section: ApplicationFormNode | ApplicationFormNode[] =
        rootLevelSections[sectionName];

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
                      applicant.sectionRestrictions?.[sectionIdentifier],
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
            },
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
    section: ApplicationFormSections,
  ): ApplicationFormSections => {
    return Object.keys(section).reduce((acc, sectionName) => {
      const subsection: ApplicationFormNode | ApplicationFormNode[] =
        section[sectionName];
      let result: ApplicationFormNode | Array<ApplicationFormNode>;

      if (subsection instanceof Array) {
        result = subsection.map(
          ({ sections, sectionRestrictions, ...rest }) => ({
            sections: purgeUIFields(sections),
            ...rest,
          }),
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
    attachments,
  };
};

export const getSectionFavouriteTarget = (
  id?: number,
): FavouriteTarget | null => {
  if (!id) {
    return null;
  }

  const state: RootState = store.getState();
  return (
    state.favourite?.favourite?.targets?.find(
      (target) => target.plot_search_target.id === id,
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
  reduxFormPath: string,
  formName: string,
): ApplicantTypes => {
  if (section.identifier !== APPLICANT_SECTION_IDENTIFIER) {
    return ApplicantTypes.NOT_APPLICABLE;
  }

  return (
    formValueSelector(formName)(
      state,
      `${reduxFormPath}.metadata.applicantType`,
    ) || ApplicantTypes.UNSELECTED
  );
};

export const getFieldFileIds = (
  state: RootState,
  fieldPath: string,
  formName: string,
): Array<number> => {
  const fieldValue = formValueSelector(formName)(state, fieldPath);
  return fieldValue?.value || [];
};

export const getFieldValue = (
  state: RootState,
  fieldPath: string,
  formName: string,
): FieldValue => {
  return formValueSelector(formName)(state, fieldPath);
};

export const getClientErrorMessage = (
  lastClientError: ApplicationPreparationError | null,
): string => {
  const { t } = useTranslation();

  switch (lastClientError) {
    case ApplicationPreparationError.NoApplicantTypeSet:
      return t(
        'application.error.preparation.noApplicantTypeSet',
        'An applicant with no selected type was encountered. Please verify that all applicant data is filled correctly.',
      );
      break;
    case ApplicationPreparationError.NoApplicantIdentifierFound:
      return t(
        'application.error.preparation.noApplicantIdentifierFound',
        'An applicant with missing identifier data was encountered. Please verify that each applicant has either the personal identification number or company ID number set.',
      );
      break;
    case ApplicationPreparationError.MisconfiguredPlotSearch:
      return t(
        'application.error.preparation.misconfiguredPlotSearch',
        "A problem with the search you're applying to was encountered. Please try again later.",
      );
      break;
    case ApplicationPreparationError.NoAreaSearchFound:
      return t(
        'areaSearch.application.error.preparation.misconfiguredPlotSearch',
        "An area search you're applying to is not found. Please try to define the area again.",
      );
      break;
    default:
      return t(
        'application.error.preparation.unknown',
        'An unexpected error occurred while preparing the application data for submission. Please try again later.',
      );
      break;
  }
};

type PathPart = {
  kind: 'objectKey' | 'arrayKey' | 'index';
  value: string;
};

const getPathParts = (path: string): Array<PathPart> => {
  const result: Array<PathPart> = [];
  const dotParts = path.split('.');

  if (dotParts[0] === '') {
    dotParts.shift();
  }
  dotParts.forEach((part) => {
    const maybeArrayComponents = /^(.+)\[(\d+)]$/.exec(part);
    if (maybeArrayComponents) {
      result.push({ kind: 'arrayKey', value: maybeArrayComponents[1] });
      result.push({ kind: 'index', value: maybeArrayComponents[2] });
    } else {
      result.push({ kind: 'objectKey', value: part });
    }
  });

  return result;
};

export const hideOptionalFields = (
  sectionFields: ApplicationFormFields,
): boolean => {
  const optionalFieldsCheckbox: ApplicationField | undefined =
    sectionFields[SHOW_IF_FIELD_IDENTIFIER];

  if (optionalFieldsCheckbox) {
    return optionalFieldsCheckbox?.value === false;
  } else {
    return false;
  }
};

export const get = (obj: unknown, path: string): unknown => {
  let node: unknown = obj;
  const pathParts = getPathParts(path);

  for (let i = 0; i < pathParts.length; ++i) {
    const part = pathParts[i];

    if (part.kind === 'index') {
      if (node instanceof Array) {
        node = node[parseInt(part.value)];
      } else {
        return;
      }
    } else {
      if (node instanceof Object) {
        if (part.value in node) {
          node = (node as Record<string, unknown>)[part.value];
        } else {
          return;
        }
      }
    }
  }

  return node;
};

export const set = (obj: unknown, path: string, value: unknown): void => {
  let node: unknown = obj;
  const pathParts = getPathParts(path);

  for (let i = 0; i < pathParts.length; ++i) {
    const part = pathParts[i];
    const isLast = i + 1 === pathParts.length;

    // end of path, set the value onto the final node
    if (isLast) {
      if (part.kind === 'index' && node instanceof Array) {
        node[parseInt(part.value)] = value;
      } else if (part.kind !== 'index' && node instanceof Object) {
        (node as Record<string, unknown>)[part.value] = value;
      } else {
        // invalid path
        return;
      }
    }

    // find next level node, create it if it doesn't exist
    if (part.kind === 'objectKey') {
      if (node instanceof Object) {
        if (!(node as Record<string, unknown>)[part.value]) {
          (node as Record<string, unknown>)[part.value] = {};
        }
        node = (node as Record<string, unknown>)[part.value];
      } else {
        // invalid path
        return;
      }
    } else if (part.kind === 'arrayKey') {
      if (node instanceof Object) {
        if (!(node as Record<string, unknown>)[part.value]) {
          (node as Record<string, unknown>)[part.value] = [];
        }
        node = (node as Record<string, unknown>)[part.value];
      } else {
        // invalid path
        return;
      }
    } else {
      if (node instanceof Array) {
        if (!node[parseInt(part.value)]) {
          // peek next node
          const nextPart = pathParts[i + 1];
          if (nextPart.kind === 'index') {
            node[parseInt(part.value)] = [];
          } else {
            node[parseInt(part.value)] = {};
          }
        }
        node = node[parseInt(part.value)];
      } else {
        // invalid path
        return;
      }
    }
  }
};
