type Props = {
  error: unknown;
};

const ApplicationFieldError = ({ error }: Props): JSX.Element | null => {
  if (
    !error ||
    (typeof error === 'object' && !Object.keys(error).includes('value'))
  ) {
    return null;
  }

  return (
    <div className="ApplicationFieldError">
      {(error as { value: string }).value}
    </div>
  );
};

export default ApplicationFieldError;
