import React from 'react';

interface Props {
  children?: JSX.Element,
}

const SidePanel = ({
  children,
}: Props): JSX.Element => {
  return(
    <div className='side-panel'>
      {children}
    </div>
  );
};

export default SidePanel;
