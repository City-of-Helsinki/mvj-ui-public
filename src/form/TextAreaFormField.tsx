import React, { ChangeEvent } from 'react';
import { TextArea, TextAreaProps } from 'hds-react';
import { WrappedFieldProps } from 'redux-form';

const TextAreaFormField = ({
  input,
  meta,
  onChange,
  ...rest
}: WrappedFieldProps & TextAreaProps): JSX.Element => {
  const onChangeHandler = (e: ChangeEvent<HTMLTextAreaElement>): void => {
    if (onChange) {
      onChange(e);
    }
    input.onChange(e);
  };

  return (
    <TextArea
      {...input}
      onChange={onChangeHandler}
      value={input.value}
      invalid={meta.touched && meta.invalid}
      errorText={meta.touched && meta.error}
      {...rest}
    />
  );
};

export default TextAreaFormField;
