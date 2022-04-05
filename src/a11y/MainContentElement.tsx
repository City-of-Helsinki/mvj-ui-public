import React, { PropsWithChildren } from 'react';
import classNames from 'classnames';

const MainContentElement = ({
  children,
  className,
}: PropsWithChildren<{ className?: string }>): JSX.Element => {
  return (
    <div id="content" className={classNames('MainContentElement', className)}>
      {children}
    </div>
  );
};

export default MainContentElement;
