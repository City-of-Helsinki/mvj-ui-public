import React from 'react';
import { FileInput } from 'hds-react';
import { useTranslation } from 'react-i18next';

import { FormField } from '../../plotSearch/types';
import { Language } from '../../i18n/types';
import { logError } from '../../root/helpers';

interface Props {
  id: string;
  field: FormField;
}

const ApplicationFileUploadField = ({ id, field }: Props): JSX.Element => {
  const { i18n } = useTranslation();

  const uploadFile = (files: Array<File>): void => {
    logError(['unimplemented', files]);
    // dispatch file send action here
  };

  return (
    <div className="ApplicationFileUploadField">
      <FileInput
        id={id}
        multiple
        maxSize={20 * 1024 * 1024}
        onChange={uploadFile}
        required={field.required}
        label={field.label}
        helperText={field.hint_text}
        language={i18n.language as Language}
      />
    </div>
  );
};

export default ApplicationFileUploadField;
