import React, { Component } from 'react';
import CloseButton from '../button/closeButton';
import classNames from 'classnames';

interface Props {
  children?: JSX.Element,
  className?: string,
  isOpen: boolean,
  onClose: () => void,
  title: string,
  closeText: string,
}

class Modal extends Component<Props> {
  /* eslint-disable  @typescript-eslint/no-explicit-any */
  component: any

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
      onClose,
      title,
      closeText,
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
        </div>
      </div>
    );
  }
}

export default Modal;
