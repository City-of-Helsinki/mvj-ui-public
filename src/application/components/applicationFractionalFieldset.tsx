import React from 'react';
import { Fieldset, TextInput } from 'hds-react';
import { FieldRendererProps, SPLITTER, FieldType } from '../types';

const ApplicationFractionalFieldset = ({
  id,
  input,
  field,
  meta,
  setValues,
}: FieldRendererProps): JSX.Element => {
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

  const parseValue = (fieldType: FieldType): string => {
    if (!input.value.value) {
      return '';
    }
    const values = input.value.value.split(SPLITTER);
    return values[fieldType];
  };

  return (
    <div className="ApplicationFractionField">
      <Fieldset heading={field.label}>
        {/* numerator / fin: osoittaja */}
        <TextInput
          className="ApplicationFractionField__field"
          id={`${id}-numerator`}
          value={parseValue(FieldType.NUMERATOR)}
          onChange={(e) => changeHandler(e.target.value, FieldType.NUMERATOR)}
          required={field.required}
          errorText={meta.error}
          helperText={field.hint_text}
          type="number"
        />
        <span className="ApplicationFractionField__splitter"> / </span>
        {/* denominator / fin: nimittäjä */}
        <TextInput
          className="ApplicationFractionField__field"
          id={`${id}-denominator`}
          value={parseValue(FieldType.DENOMINATOR)}
          onChange={(e) => changeHandler(e.target.value, FieldType.DENOMINATOR)}
          invalid={meta.invalid}
          required={field.required}
          errorText={meta.error}
          helperText={field.hint_text}
          type="number"
        />
      </Fieldset>
    </div>
  );
};

export default ApplicationFractionalFieldset;
