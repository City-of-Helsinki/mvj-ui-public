import React from 'react';
import Modal from './modal';

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
  const {
    children,
    confirmButtonClassName,
    confirmButtonLabel = 'Tallenna',
    cancelButtonLabel = 'Peruuta',
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
        closeText={'sulje'}
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
