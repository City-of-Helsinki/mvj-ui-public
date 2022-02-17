import React, { PropsWithChildren, ReactNode } from 'react';

const ApplicationFieldsetHelperText = ({
  children,
}: PropsWithChildren<ReactNode>): JSX.Element | null => {
  if (!children) {
    return null;
  }

  return <div className="ApplicationFieldsetHelperText">{children}</div>;
};

export default ApplicationFieldsetHelperText;
