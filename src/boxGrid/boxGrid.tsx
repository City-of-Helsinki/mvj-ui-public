import { PropsWithChildren } from 'react';
import classNames from 'classnames';

const BoxGrid = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>): JSX.Element => {
  return <div className={classNames('BoxGrid', className)}>{children}</div>;
};

export default BoxGrid;
