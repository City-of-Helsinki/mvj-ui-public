import React, { ReactNode } from 'react';
import classNames from 'classnames';

interface Props {
  children?: ReactNode;
  className?: string;
}

const SidePanel = (props: Props): JSX.Element => {
  const { children } = props;
  return (
    <div className={classNames('SidePanel', props.className)}>{children}</div>
  );
};

export default SidePanel;
