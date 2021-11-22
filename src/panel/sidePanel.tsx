import React from 'react';

interface Props {
  children?: JSX.Element;
}

const SidePanel = (props: Props): JSX.Element => {
  const { children } = props;
  return <div className="side-panel">{children}</div>;
};

export default SidePanel;
