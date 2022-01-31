import React from 'react';
import { FieldRendererProps } from '../types';
import { Select } from 'hds-react';

const ApplicationSelectField = ({
  field,
  input,
  id,
  meta,
  setValue,
}: FieldRendererProps): JSX.Element => {
  type OptionType = {
    label: string;
    value: string | number | null;
  };

  const options: Array<OptionType> = field.choices.map((option) => ({
    label: option.text,
    value: option.value,
  }));
  const currentOption =
    options.find((option: OptionType) => option.value === input.value.value) ||
    null;

  return (
    <div className="ApplicationSelectField">
      <Select<OptionType>
        id={id}
        value={currentOption}
        onChange={(newValue: OptionType) => setValue(newValue.value)}
        invalid={meta.invalid}
        required={field.required}
        clearable={!field.required}
        label={field.label}
        options={options}
        helper={field.hint_text}
      />
    </div>
  );
};

export default ApplicationSelectField;
