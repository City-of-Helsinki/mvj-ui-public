import { parseISO } from 'date-fns';
import {
  APPLICANT_MAIN_IDENTIFIERS,
  ApplicantTypes,
  ApplicationFormNode,
  CONTROL_SHARE_FIELD_IDENTIFIER,
  EMAIL_FIELD_IDENTIFIER,
} from './types';
import i18n from '../i18n';
import { Form, FormSection } from '../plotSearch/types';
import { ValidateCallback } from 'redux-form';
import { get, hideOptionalFields, set } from './helpers';

const PERSONAL_IDENTIFIER_CHECK_CHAR_LIST = '0123456789ABCDEFHJKLMNPRSTUVWXY';
// from the rightmost digit to the leftmost
const COMPANY_IDENTIFIER_CHECKSUM_MULTIPLIERS = [2, 4, 8, 5, 10, 9, 7];

export const requiredValidator = (value: unknown): string | undefined => {
  if (
    value === null ||
    value === undefined ||
    value === false ||
    (value instanceof Array && value.length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  ) {
    return i18n.t('validation.errors.requiredValue', 'This field is required.');
  }
};

export const personalIdentifierValidator = (
  value: unknown,
  error?: string,
): string | undefined => {
  if (value === '') {
    return;
  }

  if (typeof value !== 'string') {
    return (
      error ||
      i18n.t(
        'validation.errors.personalIdentifier.generic',
        'Invalid personal identifier.',
      )
    );
  }

  const result =
    /^(\d{6})([-+ABCDEFUVWXY])(\d{3})([0-9ABCDEFHJKLMNPRSTUVWXY])$/.exec(
      value.toUpperCase(),
    );

  if (!result) {
    return (
      error ||
      i18n.t(
        'validation.errors.personalIdentifier.generic',
        'Invalid personal identifier.',
      )
    );
  }

  const datePart = result[1];
  const separator = result[2];
  const runningNumber = result[3];
  const checkChar = result[4];

  let century = '19';
  switch (separator) {
    case '+':
      century = '18';
      break;
    case 'A':
    case 'B':
    case 'C':
    case 'D':
    case 'E':
    case 'F':
      century = '20';
      break;
    default:
      // U-Y, -
      break;
  }

  try {
    const year = `${century}${datePart.slice(4, 6)}`;
    const month = datePart.slice(2, 4);
    const day = datePart.slice(0, 2);

    const date = parseISO(`${year}-${month}-${day}T12:00:00`);

    if (
      date.getDate() !== parseInt(day) ||
      date.getMonth() !== parseInt(month) - 1 ||
      date.getFullYear() !== parseInt(year)
    ) {
      return (
        error ||
        i18n.t(
          'validation.errors.personalIdentifier.generic',
          'Invalid personal identifier.',
        )
      );
    }
  } catch (e) {
    return (
      error ||
      i18n.t(
        'validation.errors.personalIdentifier.generic',
        'Invalid personal identifier.',
      )
    );
  }

  const calculatedCheckChar =
    PERSONAL_IDENTIFIER_CHECK_CHAR_LIST[
      parseInt(datePart + runningNumber) % 31
    ];

  if (checkChar !== calculatedCheckChar) {
    return (
      error ||
      i18n.t(
        'validation.errors.personalIdentifier.checkChar',
        "Check character doesn't match.",
      )
    );
  }
};

export const companyIdentifierValidator = (
  value: unknown,
  error?: string,
): string | undefined => {
  if (value === '') {
    return;
  }

  if (typeof value !== 'string') {
    return (
      error ||
      i18n.t(
        'validation.errors.companyIdentifier.generic',
        'Invalid company identifier.',
      )
    );
  }

  const result = /^(\d{6,7})-(\d)$/.exec(value);

  if (!result) {
    return (
      error ||
      i18n.t(
        'validation.errors.companyIdentifier.generic',
        'Invalid company identifier.',
      )
    );
  }

  const identifier = parseInt(result[1]);
  const checkNumber = parseInt(result[2]);

  let sum = 0;
  let calculatedCheckNumber;
  for (let i = 0; i < 7; ++i) {
    const digit = Math.floor((identifier / Math.pow(10, i)) % 10);
    sum += digit * COMPANY_IDENTIFIER_CHECKSUM_MULTIPLIERS[i];
  }

  calculatedCheckNumber = sum % 11;
  if (calculatedCheckNumber === 1) {
    // Company identifiers that sum up to a remainder of 1 are not handed out at all,
    // because non-zero values are subtracted from 11 to get the final number and
    // in these cases that number would be 10
    return (
      error ||
      i18n.t(
        'validation.errors.companyIdentifier.generic',
        'Invalid company identifier.',
      )
    );
  } else if (calculatedCheckNumber > 1) {
    calculatedCheckNumber = 11 - calculatedCheckNumber;
  }

  if (calculatedCheckNumber !== checkNumber) {
    return (
      error ||
      i18n.t(
        'validation.errors.companyIdentifier.checkNumber',
        "Check character doesn't match.",
      )
    );
  }
};

export const emailValidator = (
  value: unknown,
  error?: string,
): string | undefined => {
  if (!value || typeof value !== 'string') {
    return;
  }

  // A relatively simple validation that catches the most egregious examples of invalid emails.
  // (Also intentionally denies some technically valid but in this context exceedingly rare addresses,
  // like ones with quoted strings containing spaces or a right-side value without a dot.)
  if (!/^\S+@\S+\.\S{2,}$/.exec(value)) {
    return (
      error ||
      i18n.t('validation.errors.email', 'Invalid email address format.')
    );
  }
};

export const validateApplicationForm =
  (pathPrefix: string) =>
  (values: unknown, form?: Form): Record<string, unknown> => {
    let controlShareSum = 0;
    const errors = {};
    const controlSharePaths: Array<string> = [];

    const root = get(values, pathPrefix) as
      | { sections: Record<string, ApplicationFormNode> }
      | undefined;

    if (!root?.sections || !form) {
      return {};
    }

    const searchSingleSection = (
      formSection: FormSection,
      section: ApplicationFormNode,
      path: string,
    ) => {
      if (!section) {
        return;
      }

      // Hide optional fields if the checkbox is unchecked
      if (hideOptionalFields(section.fields)) {
        return;
      }

      if (formSection.fields) {
        formSection.fields.forEach((field) => {
          let validator:
            | ((value: unknown, error?: string) => string | undefined)
            | undefined;
          let validatorError;
          switch (field.identifier) {
            case APPLICANT_MAIN_IDENTIFIERS[ApplicantTypes.PERSON]
              .IDENTIFIER_FIELD:
              validator = personalIdentifierValidator;
              break;
            case APPLICANT_MAIN_IDENTIFIERS[ApplicantTypes.COMPANY]
              .IDENTIFIER_FIELD:
              validator = companyIdentifierValidator;
              break;
            case EMAIL_FIELD_IDENTIFIER:
              validator = emailValidator;
              break;
          }

          if (field.required) {
            validatorError = requiredValidator(
              section.fields[field.identifier].value,
            );
          }
          if (validator) {
            validatorError =
              validatorError ||
              validator(section.fields[field.identifier].value);
          }

          if (field.identifier === CONTROL_SHARE_FIELD_IDENTIFIER) {
            const result = /^(\d+)\s*\/\s*(\d+)$/.exec(
              section.fields[field.identifier].value as string,
            );
            if (!result) {
              set(
                errors,
                `${path}.fields.${field.identifier}.value`,
                i18n.t(
                  'validation.errors.controlShare.generic',
                  'Invalid control share fraction.',
                ),
              );
            } else {
              controlShareSum += parseInt(result[1]) / parseInt(result[2]);
              controlSharePaths.push(
                `${path}.fields.${field.identifier}.value`,
              );
            }
          }

          if (validatorError) {
            set(
              errors,
              `${path}.fields.${field.identifier}.value`,
              validatorError,
            );
          }
        });
      }

      if (formSection.subsections) {
        formSection.subsections.forEach((subsection) => {
          if (
            section.sectionRestrictions?.[subsection.identifier] &&
            ![ApplicantTypes.BOTH, section.metadata?.applicantType].includes(
              section.sectionRestrictions[subsection.identifier],
            )
          ) {
            return;
          }

          searchSection(
            subsection,
            section.sections[subsection.identifier],
            `${path}.sections.${subsection.identifier}`,
          );
        });
      }
    };

    const searchSection = (
      formSection: FormSection,
      section: ApplicationFormNode | Array<ApplicationFormNode>,
      path: string,
    ) => {
      if (section instanceof Array) {
        section.forEach((singleSection, i) =>
          searchSingleSection(formSection, singleSection, `${path}[${i}]`),
        );
      } else {
        searchSingleSection(formSection, section, path);
      }
    };

    form.sections.forEach((formSection) =>
      searchSection(
        formSection,
        root.sections[formSection.identifier],
        `${pathPrefix}.sections.${formSection.identifier}`,
      ),
    );

    if (Math.abs(controlShareSum - 1) > 1e-9) {
      controlSharePaths.forEach((path) => {
        set(
          errors,
          path,
          i18n.t(
            'validation.errors.controlShare.invalidSum',
            'Control shares of applicants must sum up to 100%.',
          ),
        );
      });
    }

    return errors;
  };

export const shouldApplicationFormValidate = <FormData, P>({
  props,
  nextProps,
  structure,
}: ValidateCallback<FormData, P, string>): boolean => {
  // By default, redux-form removes unmounted fields and also removes their sync errors
  // without also rerunning the validation function afterwards. In our use case,
  // the fields that aren't on the current tab (applicant or target) get unmounted,
  // but we do still want to retain their errors just like their values.
  // By letting redux-form know that validation should rerun on any change in registered
  // fields, we can ensure that the errors remain.
  return (
    !structure.deepEqual(
      props?.registeredFields,
      nextProps?.registeredFields,
    ) || !structure.deepEqual(props?.values, nextProps?.values)
  );
};
