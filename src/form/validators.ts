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

/**
 * Generates a validator for redux-form Field component. Expects start_date Field to also exist.
 */
export const dateAfterOrEqualValidatorGenerator =
  (customError?: string) =>
  (
    value: string,
    values: { search: { start_date: string } },
  ): string | null => {
    // values.search contains other fields defined in redux-form form
    if (value && values.search.start_date) {
      const valueDate = new Date(value);
      const comparisonDate = new Date(values.search.start_date);

      if (valueDate.valueOf() === comparisonDate.valueOf()) {
        return null;
      }

      return dateAfterValidatorGenerator(
        values.search.start_date,
        customError,
      )(value);
    }
    return null;
  };

/**
 * Generates a validator for redux-form Field component. Expects end_date Field to also exist.
 */
export const dateBeforeOrEqualValidatorGenerator =
  (customError?: string) =>
  (value: string, values: { search: { end_date: string } }): string | null => {
    // values.search contains other fields defined in redux-form form
    if (value && values.search.end_date) {
      const valueDate = new Date(value);
      const comparisonDate = new Date(values.search.end_date);

      if (valueDate.valueOf() === comparisonDate.valueOf()) {
        return null;
      }

      return dateBeforeValidatorGenerator(
        values.search.end_date,
        customError,
      )(value);
    }
    return null;
  };

/**
 * Generates a validator for redux-form Field component. Expects geometry Field to also exist.
 */
export const eitherMultiPolygonOrRequiredValidatorGenerator =
  (customError?: string) =>
  (
    value: string,
    values: { search: { geometry?: { coordinates: Array<any> } } },
  ): string | null => {
    // values.search contains other fields defined in redux-form form
    if (values.search.geometry && values.search.geometry.coordinates.length > 0)
      return null;

    if (!value)
      return (
        customError ||
        i18n.t('validation.errors.requiredValue', 'This field is required.')
      );

    return null;
  };
