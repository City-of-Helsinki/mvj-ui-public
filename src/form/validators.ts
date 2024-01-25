import i18n from '../i18n';
import { renderDate } from '../i18n/utils';
import { MultiPolygon } from 'geojson';

type genericValidatorInputTypes =
  | string
  | number
  | boolean
  | Array<unknown>
  | null;

export const requiredValidatorGenerator =
  (customError?: string) =>
  (value?: genericValidatorInputTypes): string | null => {
    if (value instanceof Array) {
      return value.length > 0
        ? customError ||
            i18n.t(
              'validation.errors.requiredArray',
              'One or more options must be selected.',
            )
        : null;
    }

    if (typeof value === 'number') {
      // 0 is falsy but valid
      return null;
    }

    return !value
      ? customError ||
          i18n.t('validation.errors.requiredValue', 'This field is required.')
      : null;
  };

export const greaterThanValidatorGenerator =
  (comparisonValue?: number, customError?: string) =>
  (value?: number): string | null => {
    if (
      (value || value === 0) &&
      (comparisonValue || comparisonValue === 0) &&
      value <= comparisonValue
    ) {
      return (
        customError ||
        i18n.t(
          'validation.errors.greaterThan',
          'Please enter a value greater than {{number}}.',
          { number: comparisonValue },
        )
      );
    }

    return null;
  };

export const lessThanValidatorGenerator =
  (comparisonValue?: number, customError?: string) =>
  (value?: number): string | null => {
    if (
      (value || value === 0) &&
      (comparisonValue || comparisonValue === 0) &&
      value >= comparisonValue
    ) {
      return (
        customError ||
        i18n.t(
          'validation.errors.lessThan',
          'Please enter a value less than {{number}}.',
          { number: comparisonValue },
        )
      );
    }

    return null;
  };

export const dateAfterValidatorGenerator =
  (comparisonValue?: string, customError?: string) =>
  (value?: string): string | null => {
    if (value && comparisonValue) {
      const valueDate = new Date(value);
      const comparisonDate = new Date(comparisonValue);

      if (valueDate.valueOf() <= comparisonDate.valueOf()) {
        return (
          customError ||
          i18n.t(
            'validation.errors.dateAfter',
            'The selected date cannot be before {{date}}.',
            { date: renderDate(comparisonDate) },
          )
        );
      }
    }

    return null;
  };

export const dateBeforeValidatorGenerator =
  (comparisonValue?: string, customError?: string) =>
  (value?: string): string | null => {
    if (value && comparisonValue) {
      const valueDate = new Date(value);
      const comparisonDate = new Date(comparisonValue);

      if (valueDate.valueOf() >= comparisonDate.valueOf()) {
        return (
          customError ||
          i18n.t(
            'validation.errors.dateBefore',
            'The selected date cannot be after {{date}}.',
            { date: renderDate(comparisonDate) },
          )
        );
      }
    }

    return null;
  };

export const dateAfterOrEqualValidatorGenerator =
  (comparisonValue?: string, customError?: string) =>
  (value?: string): string | null => {
    if (value && comparisonValue) {
      const valueDate = new Date(value);
      const comparisonDate = new Date(comparisonValue);

      if (valueDate.valueOf() === comparisonDate.valueOf()) {
        return null;
      }

      return dateAfterValidatorGenerator(comparisonValue, customError)(value);
    }
    return null;
  };

export const dateBeforeOrEqualValidatorGenerator =
  (comparisonValue?: string, customError?: string) =>
  (value?: string): string | null => {
    if (value && comparisonValue) {
      const valueDate = new Date(value);
      const comparisonDate = new Date(comparisonValue);

      if (valueDate.valueOf() === comparisonDate.valueOf()) {
        return null;
      }

      return dateBeforeValidatorGenerator(comparisonValue, customError)(value);
    }
    return null;
  };

export const nonEmptyMultiPolygonValidatorGenerator =
  (customError?: string) =>
  (value?: MultiPolygon | null): string | null => {
    if (value && value.coordinates.length > 0) {
      return null;
    }

    return (
      customError ||
      i18n.t(
        'validation.errors.nonEmptyGeometry',
        'No area has yet been selected.',
      )
    );
  };

export const eitherMultiPolygonOrRequiredValidatorGenerator =
  (comparisonValue?: MultiPolygon | null, customError?: string) =>
  (value?: string): string | null => {
    if (comparisonValue) return null;

    return !value
      ? customError ||
          i18n.t('validation.errors.requiredValue', 'This field is required.')
      : null;
  };
