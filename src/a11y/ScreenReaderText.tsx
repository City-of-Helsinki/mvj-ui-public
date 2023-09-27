import React from 'react';

const ScreenReaderText = ({
  children,
}: React.PropsWithChildren<Record<never, never>>): JSX.Element => (
  <div className="ScreenReaderText">{children}</div>
);

export default ScreenReaderText;
