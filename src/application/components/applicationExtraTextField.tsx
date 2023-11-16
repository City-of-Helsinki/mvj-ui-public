import { TextInput } from 'hds-react';
import { FieldRendererProps } from '../types';

interface ExtraTextFieldProps {
  disabled: boolean;
  parentId: string;
}

const ApplicationExtraTextField = ({
  parentId,
  input,
  meta,
  setValues,
  disabled,
}: Omit<FieldRendererProps, 'id'> & ExtraTextFieldProps): JSX.Element => {
  return (
    <div className="ApplicationExtraTextField">
      <TextInput
        id={`${parentId}_extra`}
        value={input.value.extraValue}
        onChange={(e) => setValues({ extraValue: e.target.value })}
        invalid={meta.invalid}
        required
        errorText={meta.error}
        aria-labelledby={parentId}
        disabled={disabled}
      />
    </div>
  );
};

export default ApplicationExtraTextField;
