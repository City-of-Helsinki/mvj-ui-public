import React, { Component } from 'react';
import CloseButton from '../button/closeButton';
import classNames from 'classnames';
import Button from '../button/button';

interface Props {
  children?: JSX.Element,
  className?: string,
  isOpen: boolean,
  onClose: () => void,
  onCancel: () => void,
  onSave: () => void,
  title: string,
  closeText: string,
  confirmButtonClassName?: string,
  confirmButtonLabel: string,
  cancelButtonLabel: string,
}

class Modal extends Component<Props> {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  cancelButton: any
  component: any

  setCancelButtonRef = (element: unknown): void => {
    this.cancelButton = element;
  }

  state = {
    isClosing: false,
    isOpening: false,
  }

  componentDidMount(): void {
    // this.component.addEventListener('transitionend', this.transitionEnds);
  }

  componentWillUnmount(): void {
    // this.component.removeEventListener('transitionend', this.transitionEnds);
  }

  componentDidUpdate(prevProps: Props): void {
    if(!prevProps.isOpen && this.props.isOpen) {
      this.setState({
        isOpening: true,
      });
      if(this.cancelButton) {
        this.cancelButton.focus();
      }
    } else if(prevProps.isOpen && !this.props.isOpen) {
      this.setState({
        isClosing: true,
      });
    }
  }

  setComponentRef = (element: unknown): void => {
    this.component = element;
  }

  transitionEnds = (): void => {
    this.setState({
      isClosing: false,
      isOpening: false,
    });
  }

  render(): JSX.Element {
    const {
      children,
      className,
      isOpen,
      title,
      closeText,
      confirmButtonClassName,
      confirmButtonLabel,
      cancelButtonLabel,
      onCancel,
      onSave,
      onClose,
    } = this.props;
    const {isClosing, isOpening} = this.state;

    return (
      <div ref={this.setComponentRef} className={classNames('modal', className, {'modal-open': isOpen})}>
        <div className='modal__overlay'></div>
        <div className='modal__wrapper'>

          <div className='modal__header' hidden={!isOpen && !isClosing && !isOpening}>
            <div className='modal__header_wrapper'>
              <h1 className='title'>{title}</h1>
              <CloseButton
                className='position-topright'
                onClick={onClose}
                title={closeText}
              />
            </div>
          </div>
          <div className='modal__content' hidden={!isOpen && !isClosing && !isOpening}>
            {children}
          </div>
          <div className='confirmation-modal__footer' hidden={!isOpen && !isClosing && !isOpening}>
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
        </div>
      </div>
    );
  }
}

export default Modal;
