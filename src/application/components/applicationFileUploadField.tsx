import { useState } from 'react';
import { Button, Fieldset, FileInput, IconCrossCircle } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';

import { FormField } from '../../plotSearch/types';
import { Language } from '../../i18n/types';
import { RootState } from '../../root/rootReducer';
import {
  APPLICATION_FORM_NAME,
  FileUploadError,
  UploadedFileMeta,
} from '../types';
import { deleteUpload, uploadFile } from '../actions';
import BlockLoader from '../../loader/blockLoader';
import { renderDateTime } from '../../i18n/utils';
import { getFieldFileIds } from '../helpers';
import { change, formValueSelector } from 'redux-form';

interface Props {
  id: string;
  field: FormField;
  fieldName: string;
}

interface InnerProps {
  pendingUploads: Array<UploadedFileMeta>;
  isPerformingFileOperation: boolean;
  fieldFileIds: Array<number>;
  attachmentIds: Array<number>;
  deleteUpload: typeof deleteUpload;
  uploadFile: typeof uploadFile;
  change: typeof change;
}

const ApplicationFileUploadField = ({
  id,
  field,
  fieldName,
  pendingUploads,
  deleteUpload,
  uploadFile,
  isPerformingFileOperation,
  fieldFileIds,
  attachmentIds,
  change,
}: Props & InnerProps): JSX.Element => {
  const { i18n, t } = useTranslation();
  const [error, setError] = useState<string | null>(null);

  const filesForField = pendingUploads.filter((upload) =>
    fieldFileIds.includes(upload.id),
  );

  const addId = (id: number) => {
    change(APPLICATION_FORM_NAME, `${fieldName}.value`, [...fieldFileIds, id]);
    change(APPLICATION_FORM_NAME, 'attachments', [...attachmentIds, id]);
  };

  const removeId = (id: number) => {
    change(
      APPLICATION_FORM_NAME,
      `${fieldName}.value`,
      fieldFileIds.filter((fileId) => fileId !== id),
    );
    change(
      APPLICATION_FORM_NAME,
      'attachments',
      attachmentIds.filter((fileId) => fileId !== id),
    );
  };

  const onSubmit = (files: Array<File> | null): void => {
    if (files) {
      setError(null);
      uploadFile({
        fileData: {
          field: field.id,
          file: files[0],
        },
        callback: (uploadedFile, error) => {
          if (uploadedFile) {
            addId(uploadedFile.id);
          } else if (error) {
            switch (error) {
              case FileUploadError.NonOkResponse:
                setError(
                  t(
                    'application.fileUpload.error.nonOkResponse',
                    'The file could not be uploaded! Please try again later.',
                  ),
                );
                break;
              case FileUploadError.Exception:
                setError(
                  t(
                    'application.fileUpload.error.exception',
                    'Something went wrong while trying to upload the file. Please try again later.',
                  ),
                );
                break;
              default:
                break;
            }
          }
        },
      });
    }
  };

  const onDelete = (file: UploadedFileMeta) => {
    deleteUpload(file.id);
    removeId(file.id);
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
                    },
                  )}
                </th>
                <td>{upload.name}</td>
                <td>{renderDateTime(new Date(upload.created_at))}</td>
                <td>
                  <Button
                    onClick={() => onDelete(upload)}
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
                    'No files have yet been uploaded.',
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
              },
            )}
            errorText={error ? error : undefined}
          />
        )}
      </Fieldset>
    </div>
  );
};

export default connect(
  (
    state: RootState,
    props: Props,
  ): Omit<InnerProps, 'deleteUpload' | 'uploadFile' | 'change'> => ({
    pendingUploads: state.application.pendingUploads,
    isPerformingFileOperation: state.application.isPerformingFileOperation,
    fieldFileIds: getFieldFileIds(
      state,
      props.fieldName,
      APPLICATION_FORM_NAME,
    ),
    attachmentIds: formValueSelector(APPLICATION_FORM_NAME)(
      state,
      'attachments',
    ),
  }),
  {
    deleteUpload,
    uploadFile,
    change,
  },
)(ApplicationFileUploadField);
