import { FocusEventHandler, useRef } from 'react';
import { Fieldset, TextInput } from 'hds-react';
import { useTranslation } from 'react-i18next';

import { FieldRendererProps, SPLITTER, FieldType } from '../types';
import ApplicationFieldError from './ApplicationFieldError';

const ApplicationFractionalFieldset = ({
  id,
  input,
  field,
  meta,
  setValues,
  displayError,
}: FieldRendererProps): JSX.Element => {
  const { t } = useTranslation();

  const firstField = useRef<HTMLInputElement>(null);
  const secondField = useRef<HTMLInputElement>(null);

  const changeHandler = (value: string, fieldType: FieldType): void => {
    if (!value) {
      value = '0';
    }

    if (!input.value?.value) {
      const newValue = '1 / 1';
      const values = newValue.split(SPLITTER);
      values[fieldType] = value;
      setValues({
        value: `${values[FieldType.NUMERATOR] || ''}${SPLITTER}${
          values[FieldType.DENOMINATOR] || ''
        }`,
      });
    } else {
      const values = input.value.value.split(SPLITTER);
      values[fieldType] = value;
      setValues({
        value: `${values[FieldType.NUMERATOR] || ''}${SPLITTER}${
          values[FieldType.DENOMINATOR] || ''
        }`,
      });
    }
  };

  const blurHandler: FocusEventHandler<HTMLInputElement> = (event) => {
    if (
      event.relatedTarget !== firstField.current &&
      event.relatedTarget !== secondField.current
    ) {
      input.onBlur(input.value);
    }
  };

  const parseValue = (fieldType: FieldType): string => {
    if (!input.value.value) {
      return '';
    }
    const values = input.value.value.split(SPLITTER);
    return values[fieldType];
  };

  return (
    <div className="ApplicationFractionField">
      <Fieldset heading={field.label} helperText={field.hint_text}>
        <div className="ApplicationFractionField__fields">
          {/* numerator / fin: osoittaja */}
          <TextInput
            className="ApplicationFractionField__field"
            id={`${id}-numerator`}
            value={parseValue(FieldType.NUMERATOR)}
            onChange={(e) => changeHandler(e.target.value, FieldType.NUMERATOR)}
            required={field.required}
            invalid={displayError && meta.invalid}
            type="number"
            min={1}
            label={t(
              'components.form.fractionalFieldset.numerator',
              'Numerator',
            )}
            hideLabel
            ref={firstField}
            onBlur={blurHandler}
          />
          <span className="ApplicationFractionField__splitter"> / </span>
          {/* denominator / fin: nimittäjä */}
          <TextInput
            className="ApplicationFractionField__field"
            id={`${id}-denominator`}
            value={parseValue(FieldType.DENOMINATOR)}
            onChange={(e) =>
              changeHandler(e.target.value, FieldType.DENOMINATOR)
            }
            invalid={displayError && meta.invalid}
            required={field.required}
            type="number"
            min={1}
            label={t(
              'components.form.fractionalFieldset.denominator',
              'Denominator',
            )}
            hideLabel
            ref={secondField}
            onBlur={blurHandler}
          />
        </div>
        <ApplicationFieldError error={displayError && meta.error?.value} />
      </Fieldset>
    </div>
  );
};

export default ApplicationFractionalFieldset;
