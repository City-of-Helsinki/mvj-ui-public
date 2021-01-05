import React, {Component} from 'react';

import Button from '../button/button';
import Modal from './modal';

interface Props {
  confirmButtonClassName?: string;
  confirmButtonLabel?: string;
  isOpen: boolean;
  label: any;
  onCancel: () => void;
  onClose: () => void;
  onSave: () => void;
  title: string;
}

class ConfirmationModal extends Component<Props> {
  cancelButton: any

  setCancelButtonRef = (element: any) => {
    this.cancelButton = element;
  }

  componentDidUpdate(prevProps: Props) {
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
      isOpen,
      label,
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
        >
          <p>{label}</p>
          <div className='confirmation-modal__footer'>
            <Button
              className={'secondary'}
              innerRef={this.setCancelButtonRef}
              onClick={onCancel}
              text='Peruuta'
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
