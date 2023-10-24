import { parseISO } from 'date-fns';
import { ApplicationFormNode, CONTROL_SHARE_FIELD_IDENTIFIER } from './types';
import i18n from '../i18n';

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

const get = (obj: unknown, path: string): unknown => {
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
const set = (obj: unknown, path: string, value: unknown): void => {
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
  error?: string
): string | undefined => {
  if (value === '') {
    return;
  }

  if (typeof value !== 'string') {
    return (
      error ||
      i18n.t(
        'validation.errors.personalIdentifier.generic',
        'Invalid personal identifier.'
      )
    );
  }

  const result =
    /^(\d{6})([-+ABCDEFUVWXY])(\d{3})([0-9ABCDEFHJKLMNPRSTUVWXY])$/.exec(
      value.toUpperCase()
    );

  if (!result) {
    return (
      error ||
      i18n.t(
        'validation.errors.personalIdentifier.generic',
        'Invalid personal identifier.'
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
          'Invalid personal identifier.'
        )
      );
    }
  } catch (e) {
    return (
      error ||
      i18n.t(
        'validation.errors.personalIdentifier.generic',
        'Invalid personal identifier.'
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
        "Check character doesn't match."
      )
    );
  }
};

export const companyIdentifierValidator = (
  value: unknown,
  error?: string
): string | undefined => {
  if (value === '') {
    return;
  }

  if (typeof value !== 'string') {
    return (
      error ||
      i18n.t(
        'validation.errors.companyIdentifier.generic',
        'Invalid company identifier.'
      )
    );
  }

  const result = /^(\d{6,7})-(\d)$/.exec(value);

  if (!result) {
    return (
      error ||
      i18n.t(
        'validation.errors.companyIdentifier.generic',
        'Invalid company identifier.'
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
        'Invalid company identifier.'
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
        "Check character doesn't match."
      )
    );
  }
};

export const emailValidator = (
  value: unknown,
  error?: string
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
  (values: unknown): Record<string, unknown> => {
    let sum = 0;
    const errors = {};
    const controlSharePaths: Array<string> = [];

    const root = get(values, pathPrefix) as
      | { sections: Record<string, ApplicationFormNode> }
      | undefined;

    if (!root?.sections) {
      return {};
    }

    const searchSingleSection = (
      section: ApplicationFormNode,
      path: string
    ) => {
      if (section.fields) {
        Object.keys(section.fields).map((fieldIdentifier) => {
          if (fieldIdentifier === CONTROL_SHARE_FIELD_IDENTIFIER) {
            const result = /^(\d+)\s*\/\s*(\d+)$/.exec(
              section.fields[fieldIdentifier].value as string
            );
            if (!result) {
              set(
                errors,
                `${path}.fields.${fieldIdentifier}.value`,
                i18n.t(
                  'validation.errors.controlShare.generic',
                  'Invalid control share fraction.'
                )
              );
            } else {
              sum += parseInt(result[1]) / parseInt(result[2]);
              controlSharePaths.push(`${path}.fields.${fieldIdentifier}.value`);
            }
          }
        });
      }

      if (section.sections) {
        Object.keys(section.sections).map((identifier) =>
          searchSection(
            section.sections[identifier],
            `${path}.sections.${identifier}`
          )
        );
      }
    };

    const searchSection = (
      section: ApplicationFormNode | Array<ApplicationFormNode>,
      path: string
    ) => {
      if (section instanceof Array) {
        section.forEach((singleSection, i) =>
          searchSingleSection(singleSection, `${path}[${i}]`)
        );
      } else {
        searchSingleSection(section, path);
      }
    };

    Object.keys(root.sections).map((identifier) =>
      searchSection(
        root.sections[identifier],
        `${pathPrefix}.sections.${identifier}`
      )
    );

    if (Math.abs(sum - 1) > 1e-9) {
      controlSharePaths.forEach((path) => {
        set(
          errors,
          path,
          i18n.t(
            'validation.errors.controlShare.invalidSum',
            'Control shares of applicants must sum up to 100%.'
          )
        );
      });
    }

    return errors;
  };
