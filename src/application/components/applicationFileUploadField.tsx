import React from 'react';
import { Button, Fieldset, FileInput, IconCrossCircle } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { FormField } from '../../plotSearch/types';
import { Language } from '../../i18n/types';
import { RootState } from '../../root/rootReducer';
import { UploadedFileMeta } from '../types';
import { deleteUpload, uploadFile } from '../actions';
import BlockLoader from '../../loader/blockLoader';
import { renderDateTime } from '../../i18n/utils';

interface State {
  pendingUploads: Array<UploadedFileMeta>;
  isPerformingFileOperation: boolean;
}

interface Props {
  id: string;
  field: FormField;
  pendingUploads: Array<UploadedFileMeta>;
  deleteUpload: typeof deleteUpload;
  uploadFile: typeof uploadFile;
  isPerformingFileOperation: boolean;
}

const ApplicationFileUploadField = ({
  id,
  field,
  pendingUploads,
  deleteUpload,
  uploadFile,
  isPerformingFileOperation,
}: Props): JSX.Element => {
  const { i18n, t } = useTranslation();

  const filesForField = pendingUploads.filter(
    (upload) => upload.field === field.id
  );

  const onSubmit = (files: Array<File> | null): void => {
    if (files) {
      uploadFile({
        field: field.id,
        file: files[0],
      });
    }
  };

  return (
    <div className="ApplicationFileUploadField">
      <Fieldset heading={field.label}>
        <table className="ApplicationFileUploadField__pending-uploads">
          <thead>
            <tr>
              <th>{t('application.fileUpload.number', 'Attachment')}</th>
              <th>{t('application.fileUpload.filename', 'File')}</th>
              <th>{t('application.fileUpload.uploadedAt', 'Uploaded at')}</th>
              <th>{t('application.fileUpload.deleteHeader', 'Delete')}</th>
            </tr>
          </thead>
          <tbody>
            {filesForField.map((upload, i) => (
              <tr key={upload.id}>
                <th>
                  {t(
                    'application.fileUpload.rowLabel',
                    'Attachment #{{number}}',
                    {
                      number: i + 1,
                    }
                  )}
                </th>
                <td>{upload.name}</td>
                <td>{renderDateTime(new Date(upload.created_at))}</td>
                <td>
                  <Button
                    onClick={() => deleteUpload(upload.id)}
                    variant="supplementary"
                    iconLeft={<IconCrossCircle />}
                    disabled={isPerformingFileOperation}
                  >
                    {t('application.fileUpload.delete', 'Delete')}
                  </Button>
                </td>
              </tr>
            ))}
            {filesForField.length === 0 && (
              <tr>
                <td
                  colSpan={4}
                  className="ApplicationFileUploadField__no-files-uploaded"
                >
                  {t(
                    'application.fileUpload.noFilesUploaded',
                    'No files have yet been uploaded.'
                  )}
                </td>
              </tr>
            )}
          </tbody>
        </table>
        {isPerformingFileOperation ? (
          <BlockLoader />
        ) : (
          <FileInput
            id={id}
            maxSize={20 * 1024 * 1024}
            onChange={onSubmit}
            required={field.required && filesForField.length === 0}
            label={t('application.fileUpload.newFile', 'Upload a new file')}
            helperText={field.hint_text || ' '}
            language={i18n.language as Language}
            infoText={t(
              'application.fileUpload.info',
              'The maximum allowed file size is {{maxSize}} MB.',
              {
                maxSize: 20,
              }
            )}
          />
        )}
      </Fieldset>
    </div>
  );
};

export default connect(
  (state: RootState): State => ({
    pendingUploads: state.application.pendingUploads,
    isPerformingFileOperation: state.application.isPerformingFileOperation,
  }),
  {
    deleteUpload,
    uploadFile,
  }
)(ApplicationFileUploadField);
