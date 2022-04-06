import React from 'react';
import { WrappedFieldProps, blur, focus, touch } from 'redux-form';
import { FileInput } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { Language } from '../i18n/types';
import { useFileUploads } from './FileUploadsContext';

/* TODO: hds-react doesn't export this; maybe it should */
export type FileInputProps = {
  accept?: string;
  buttonLabel?: string;
  className?: string;
  disabled?: boolean;
  dragAndDrop?: boolean;
  dragAndDropLabel?: string;
  dragAndDropInputLabel?: string;
  errorText?: string;
  helperText?: string;
  id: string;
  infoText?: string;
  label: string;
  language?: Language;
  maxSize?: number;
  multiple?: boolean;
  onChange: (files: File[]) => void;
  required?: boolean;
  style?: React.CSSProperties;
  successText?: string;
  tooltipLabel?: string;
  tooltipButtonLabel?: string;
  tooltipText?: string;
};

type Props = {
  focus: typeof focus;
  blur: typeof blur;
  touch: typeof touch;
};

const FileInputFormField = ({
  input,
  meta,
  blur,
  focus,
  touch,
  ...rest
}: WrappedFieldProps &
  Props &
  Omit<FileInputProps, 'onChange'>): JSX.Element => {
  const { i18n } = useTranslation();
  const fileContext = useFileUploads();

  const onChangeHandler = (files: Array<File>): void => {
    fileContext.setFieldFiles(input.name, files);
    focus(meta.form, input.name);
    touch(meta.form, input.name);
    blur(meta.form, input.name, files.length);
  };

  return (
    <FileInput
      {...input}
      onChange={onChangeHandler}
      language={i18n.language as Language}
      errorText={meta.touched && meta.error}
      {...rest}
    />
  );
};

export default connect(null, {
  focus,
  blur,
  touch,
})(FileInputFormField);
