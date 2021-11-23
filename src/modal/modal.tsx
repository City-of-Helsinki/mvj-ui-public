import React, { useEffect, useRef, useState } from 'react';
import CloseButton from '../button/closeButton';
import classNames from 'classnames';
import Button from '../button/button';

interface Props {
  children?: JSX.Element;
  className?: string;
  isOpen: boolean;
  onClose: () => void;
  onCancel: () => void;
  onSave: () => void;
  title: string;
  closeText: string;
  confirmButtonClassName?: string;
  confirmButtonLabel: string;
  cancelButtonLabel: string;
}

const Modal = (props: Props): JSX.Element => {
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
  } = props;

  const [isClosing, setIsClosing] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  // const [component, setComponent] = useState<JSX.Element | HTMLDivElement | null>();
  const [cancelButton, setCancelButton] = useState<
    HTMLButtonElement | unknown
  >();

  const usePrevious = (value: boolean): boolean | undefined => {
    const ref = useRef<boolean>();
    useEffect(() => {
      ref.current = value;
    });
    return ref.current;
  };

  const prevIsOpen = usePrevious(isOpen);

  useEffect(() => {
    if (prevIsOpen && !isOpen) {
      setIsClosing(true);
      return;
    }
    if (!prevIsOpen && isOpen) {
      setIsOpening(true);

      if (cancelButton instanceof HTMLButtonElement) {
        cancelButton.focus();
      }
    }
  });

  return (
    <div className={classNames('modal', className, { 'modal-open': isOpen })}>
      <div className="modal__overlay" />
      <div className="modal__wrapper">
        <div
          className="modal__header"
          hidden={!isOpen && !isClosing && !isOpening}
        >
          <div className="modal__header_wrapper">
            <h1 className="title">{title}</h1>
            <CloseButton
              className="position-topright"
              onClick={onClose}
              title={closeText}
            />
          </div>
        </div>
        <div
          className="modal__content"
          hidden={!isOpen && !isClosing && !isOpening}
        >
          {children}
        </div>
        <div
          className="confirmation-modal__footer"
          hidden={!isOpen && !isClosing && !isOpening}
        >
          <Button
            className={'secondary'}
            innerRef={(btn) => setCancelButton(btn)}
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
};

export default Modal;
