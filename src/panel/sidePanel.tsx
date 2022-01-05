import React, { ReactNode } from 'react';
import classNames from 'classnames';
import { IconAngleLeft, IconAngleRight } from 'hds-react';

interface Props {
  children?: ReactNode;
  className?: string;
  isOpen?: boolean;
  toggle?: (newValue: boolean) => void;
}

const SidePanel = ({
  children,
  isOpen = true,
  toggle,
  className,
}: Props): JSX.Element => {
  return (
    <div
      className={classNames('SidePanel', className, {
        'SidePanel--open': !toggle || isOpen,
      })}
    >
      {!!toggle && (
        <button className="SidePanel__toggler" onClick={() => toggle(!isOpen)}>
          {isOpen ? <IconAngleLeft size="l" /> : <IconAngleRight size="l" />}
        </button>
      )}
      <div className="SidePanel__content">{children}</div>
    </div>
  );
};

export default SidePanel;
