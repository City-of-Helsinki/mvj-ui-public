import { FieldRendererProps } from '../types';

const ApplicationHiddenField = ({
  id,
  input,
  field,
}: FieldRendererProps): JSX.Element => {
  return (
    <input
      id={id}
      value={input.value.value}
      required={field.required}
      type="hidden"
    />
  );
};

export default ApplicationHiddenField;
