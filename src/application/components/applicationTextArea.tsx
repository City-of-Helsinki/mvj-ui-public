import React from 'react';
import { TextArea } from 'hds-react';
import { FieldRendererProps } from '../types';

const ApplicationTextArea = ({
  id,
  input,
  field,
  meta,
  setValue,
}: FieldRendererProps): JSX.Element => {
  return (
    <div className="ApplicationTextArea">
      <TextArea
        id={id}
        value={input.value.value}
        onChange={(e) => setValue(e.target.value)}
        invalid={meta.invalid}
        required={field.required}
        errorText={meta.error}
        label={field.label}
        helperText={field.hint_text}
      />
    </div>
  );
};

export default ApplicationTextArea;
