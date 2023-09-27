import { MouseEventHandler, ReactNode } from 'react';
import classNames from 'classnames';

interface Props {
  className?: string;
  children: ReactNode;
  onClick: MouseEventHandler<HTMLButtonElement>;
}

const IconButton = ({ className, children, onClick }: Props): JSX.Element => {
  return (
    <button className={classNames('IconButton', className)} onClick={onClick}>
      {children}
    </button>
  );
};

export default IconButton;
