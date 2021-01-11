import React, { Component } from 'react';
import Modal from './modal';

interface Props {
  children?: JSX.Element,
  confirmButtonClassName?: string,
  confirmButtonLabel?: string,
  cancelButtonLabel?: string,
  isOpen: boolean,
  onCancel: () => void,
  onClose: () => void,
  onSave: () => void,
  title: string,
}

class ConfirmationModal extends Component<Props> {
  render(): JSX.Element {
    const {
      children,
      confirmButtonClassName,
      confirmButtonLabel = 'Tallenna',
      cancelButtonLabel = 'Peruut',
      isOpen,
      onCancel,
      onClose,
      onSave,
      title,
    } = this.props;

    return (
      <div className='confirmation-modal'>
        <Modal
          className='modal-small modal-autoheight'
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
  }
}

export default ConfirmationModal;
