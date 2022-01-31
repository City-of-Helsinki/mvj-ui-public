import React, { ReactNode } from 'react';

const ScreenReaderText = ({
  children,
}: React.PropsWithChildren<ReactNode>): JSX.Element => (
  <div className="ScreenReaderText">{children}</div>
);

export default ScreenReaderText;
