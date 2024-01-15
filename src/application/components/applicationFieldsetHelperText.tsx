import { PropsWithChildren } from 'react';

const ApplicationFieldsetHelperText = ({
  children,
}: PropsWithChildren<Record<never, never>>): JSX.Element | null => {
  if (!children) {
    return null;
  }

  return <div className="ApplicationFieldsetHelperText">{children}</div>;
};

export default ApplicationFieldsetHelperText;
