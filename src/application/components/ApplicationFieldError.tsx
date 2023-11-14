import classNames from 'classnames';

type Props = {
  error?: string;
  className?: string;
};

const ApplicationFieldError = ({
  error,
  className,
}: Props): JSX.Element | null => {
  if (!error) {
    return null;
  }

  return (
    <div
      className={classNames('ApplicationFieldError', className)}
      role="alert"
    >
      {error}
    </div>
  );
};

export default ApplicationFieldError;
