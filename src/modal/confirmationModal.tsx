import React from 'react';
import Modal from './modal';
import { useTranslation } from 'react-i18next';

interface Props {
  children?: JSX.Element;
  confirmButtonClassName?: string;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  isOpen: boolean;
  onCancel: () => void;
  onClose: () => void;
  onSave: () => void;
  title: string;
}

const ConfirmationModal = (props: Props): JSX.Element => {
  const { t } = useTranslation();
  const {
    children,
    confirmButtonClassName,
    confirmButtonLabel = t('common.confirmationModal.save', 'Save') || '',
    cancelButtonLabel = t('common.confirmationModal.cancel', 'Cancel') || '',
    isOpen,
    onCancel,
    onClose,
    onSave,
    title,
  } = props;

  return (
    <div className="confirmation-modal">
      <Modal
        className="modal-small modal-autoheight"
        title={title}
        isOpen={isOpen}
        onClose={onClose}
        closeText={t('common.confirmationModal.close', 'Close')}
        confirmButtonClassName={confirmButtonClassName}
        confirmButtonLabel={confirmButtonLabel}
        cancelButtonLabel={cancelButtonLabel}
        onCancel={onCancel}
        onSave={onSave}
      >
        {children}
      </Modal>
    </div>
  );
};

export default ConfirmationModal;
