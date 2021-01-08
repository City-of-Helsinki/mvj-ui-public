import React, { Component } from 'react';

import Button from '../button/button';
import Modal from './modal';

interface Props {
  confirmButtonClassName?: string;
  confirmButtonLabel?: string;
  cancelButtonLabel?: string;
  isOpen: boolean;
  label: string;
  onCancel: () => void;
  onClose: () => void;
  onSave: () => void;
  title: string;
}

class ConfirmationModal extends Component<Props> {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  cancelButton: any

  setCancelButtonRef = (element: unknown): void => {
    this.cancelButton = element;
  }

  componentDidUpdate(prevProps: Props): void {
    if(!prevProps.isOpen && this.props.isOpen) {
      if(this.cancelButton) {
        this.cancelButton.focus();
      }
    }
  }

  render(): JSX.Element {
    const {
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
          closeText={'sulje'}>
          <div className='confirmation-modal__footer'>
            <Button
              className={'secondary'}
              innerRef={this.setCancelButtonRef}
              onClick={onCancel}
              text={cancelButtonLabel}
            />
            <Button
              className={confirmButtonClassName || 'success'}
              onClick={onSave}
              text={confirmButtonLabel}
            />
          </div>
        </Modal>
      </div>
    );
  }
}

export default ConfirmationModal;
