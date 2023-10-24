import { TextInput } from 'hds-react';
import { FieldRendererProps } from '../types';

const ApplicationTextField = ({
  id,
  input,
  field,
  meta,
  setValues,
  displayError,
}: FieldRendererProps): JSX.Element => {
  return (
    <div className="ApplicationTextField">
      <TextInput
        id={id}
        value={input.value.value}
        onChange={(e) => setValues({ value: e.target.value })}
        onBlur={() => input.onBlur(input.value)}
        invalid={displayError && meta.invalid}
        required={field.required}
        errorText={displayError && meta.error?.value}
        label={field.label}
        helperText={field.hint_text}
      />
    </div>
  );
};

export default ApplicationTextField;
