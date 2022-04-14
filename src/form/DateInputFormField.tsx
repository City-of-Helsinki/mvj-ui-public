import React, { useState } from 'react';
import { DateInput, DateInputProps } from 'hds-react';
import { WrappedFieldProps, blur } from 'redux-form';
import { useTranslation } from 'react-i18next';

import { Language } from '../i18n/types';
import { connect } from 'react-redux';
import { renderDate } from '../i18n/utils';

interface Props {
  blur: typeof blur;
}

const DateInputFormField = ({
  input,
  blur,
  meta,
  onChange,
  ...rest
}: WrappedFieldProps & Props & DateInputProps): JSX.Element => {
  const { i18n } = useTranslation();
  const [internalValue, setInternalValue] = useState<string>(
    input.value ? renderDate(input.value) : ''
  );

  const onChangeHandler = (value: string, valueAsDate: Date): void => {
    if (onChange) {
      onChange(value, valueAsDate);
    }

    setInternalValue(value);

    if (isNaN(valueAsDate.getTime())) {
      // = "Invalid Date", either a partial date being typed manually or a blank value
      // Ignore if former, blank the actual value if latter
      if (value === '') {
        input.onChange('');
      }
    } else {
      input.onChange(valueAsDate.toISOString());
    }
  };

  const onBlurHandler = () => {
    blur(meta.form, input.name, input.value, true);
  };

  return (
    <DateInput
      {...input}
      onBlur={onBlurHandler}
      onChange={onChangeHandler}
      value={internalValue}
      language={i18n.language as Language}
      invalid={meta.touched && meta.invalid}
      errorText={meta.touched && meta.error}
      {...rest}
    />
  );
};

export default connect(null, { blur })(DateInputFormField);
