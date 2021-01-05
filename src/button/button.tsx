import React from 'react';
import classNames from 'classnames';

interface Props {
  className?: string;
  disabled?: boolean;
  innerRef?: (element: any) => void;
  onClick: () => void;
  style?: Object;
  text: string;
  title?: string;
  type?: string;
}

const Button = ({
  className, 
  disabled, 
  innerRef, 
  onClick, 
  style, 
  text, 
  title,
}: Props) => {
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
