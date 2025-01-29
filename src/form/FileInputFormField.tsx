import { WrappedFieldProps, blur, focus, touch } from 'redux-form';
import { FileInput } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { Language } from '../i18n/types';
import { useFileUploads } from './FileUploadsContext';

type FileInputProps = React.ComponentProps<typeof FileInput>;

type Props = {
  focus: typeof focus;
  blur: typeof blur;
  touch: typeof touch;
};

/**
 * Returns a string of allowed file types, each prefixed with a dot and separated by a comma and a space.
 * To be used in HDS FileInput component's "accept" prop.
 *
 * @returns {string} A string of file types.
 *
 * @example
 * // returns ".pdf,.csv,.doc,.docx,.xls,.xlsx,.ppt,.pptx,.odt,.fodt,.ods,.fods,.jpg,.jpeg,.jxl,.png,.gif,.tiff,.bmp,.svg,.webp"
 * getAllowedFileTypes();
 */
export const getAllowedFileTypes = (): string => {
  const documentTypes = [
    'pdf',
    'csv',
    'txt',
    // Word
    'doc',
    'docx',
    'xls',
    'xlsx',
    'ppt',
    'pptx',
    // OpenOffice/LibreOffice
    'odt',
    'fodt',
    'ods',
    'fods',
  ];
  const imageTypes = [
    'jpg',
    'jpeg',
    'jxl',
    'png',
    'gif',
    'tiff',
    'bmp',
    'svg',
    'webp',
  ];
  const fileTypes = [...documentTypes, ...imageTypes];
  return `${fileTypes.map((fileType) => `.${fileType}`).join(', ')}`;
};

const FileInputFormField = ({
  input,
  meta,
  blur,
  focus,
  touch,
  accept,
  ...rest
}: WrappedFieldProps & Props & FileInputProps): JSX.Element => {
  const { i18n } = useTranslation();
  const { files, setFieldFiles } = useFileUploads();
  const filesArray = files[input.name] || [];

  const onChangeHandler: FileInputProps['onChange'] = (files) => {
    setFieldFiles(input.name, files);
  };

  const onBlurHandler: FileInputProps['onBlur'] = (_e) => {
    const currentFilesArray = filesArray || [];
    blur(meta.form, input.name, currentFilesArray.length);
  };

  const onFocusHandler: FileInputProps['onFocus'] = (_e) => {
    focus(meta.form, input.name);
  };

  const onTouchEndHandler: FileInputProps['onTouchEnd'] = (_e) => {
    touch(meta.form, input.name);
  };

  return (
    <FileInput
      {...input}
      language={i18n.language as Language}
      errorText={meta.touched && meta.error}
      defaultValue={filesArray}
      accept={accept || getAllowedFileTypes()}
      {...rest}
      onChange={onChangeHandler}
      onBlur={onBlurHandler}
      onFocus={onFocusHandler}
      onTouchEnd={onTouchEndHandler}
    />
  );
};

export default connect(null, {
  focus,
  blur,
  touch,
})(FileInputFormField);
