import React from 'react';
import classNames from 'classnames';

interface Props {
  className?: string,
  disabled?: boolean,
  innerRef?: (element: unknown) => void,
  onClick: () => void,
  style?: React.CSSProperties,
  text: string,
  title?: string,
  type?: string,
}

const Button = ({
  className, 
  disabled, 
  innerRef, 
  onClick, 
  style, 
  text, 
  title,
}: Props): JSX.Element => {
  return (
    <button
      ref={innerRef}
      className={classNames('mvj-button', className)}
      onClick={onClick}
      disabled={disabled}
      style={style}
      title={title}
      type={'button'}
    >
      {text}
    </button>
  );
};

export default Button;
