// @flow
import React from 'react';
import classNames from 'classnames';

import closeIcon from '../assets/icons/close.svg';

interface Props {
  onClick: () => void;
  setReference?: (element: unknown) => void;
  title?: string;
  closeText?: string;
  className?: string;
}

const CloseButton = ({
  onClick,
  setReference,
  title,
  closeText,
  className,
}: Props): JSX.Element => {
  const handleSetReference = (element: unknown): void => {
    if (element && setReference) {
      setReference(element);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.keyCode === 13) {
      e.preventDefault();
      onClick();
    }
  };

  return (
    <button
      ref={handleSetReference}
      aria-label={closeText}
      className={classNames('close-button-component', className)}
      type={'button'}
      title={title}
      onClick={onClick}
      onKeyDown={handleKeyDown}
    >
      <img src={closeIcon} alt={closeText} />
    </button>
  );
};

export default CloseButton;
