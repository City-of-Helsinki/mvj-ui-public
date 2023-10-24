import { RadioButton, SelectionGroup } from 'hds-react';
import { FieldRendererProps, SupportedFieldTypes } from '../types';
import ApplicationExtraTextField from './applicationExtraTextField';
import ApplicationFieldsetHelperText from './applicationFieldsetHelperText';
import classNames from 'classnames';

const ApplicationRadioButtonFieldset = (
  props: FieldRendererProps,
): JSX.Element => {
  const { id, input, meta, field, fieldType, setValues, displayError } = props;

  const orientation =
    fieldType === SupportedFieldTypes.RadioButtonInline
      ? 'horizontal'
      : 'vertical';
  return (
    <div className="ApplicationRadioButtonFieldset">
      <SelectionGroup
        label={field.label}
        direction={orientation}
        className={classNames(
          'ApplicationRadioButtonFieldset__selection-group',
          `ApplicationRadioButtonFieldset__selection-group--${orientation}`,
        )}
        name={input.name}
        errorText={displayError && meta.error?.value}
      >
        {field.choices.map((option, index) => (
          <div
            className="ApplicationRadioButtonFieldset__option"
            key={option.value}
          >
            <RadioButton
              id={`ApplicationRadiobuttonFieldSet_${input.name}_${id}_${index}`}
              checked={input.value.value === option.value}
              value={input.value.value}
              onChange={() =>
                setValues({
                  value: option.value,
                  extraValue:
                    input.value.value !== option.value
                      ? ''
                      : input.value.extraValue,
                })
              }
              required={field.required}
              label={option.text}
              onBlur={() => input.onBlur(input.value)}
            />
            {option.has_text_input && (
              <ApplicationExtraTextField
                {...props}
                parentId={`ApplicationRadiobuttonFieldSet_${id}_${index}`}
                disabled={input.value.value !== option.value}
              />
            )}
          </div>
        ))}
      </SelectionGroup>
      <ApplicationFieldsetHelperText>
        {field.hint_text}
      </ApplicationFieldsetHelperText>
    </div>
  );
};

export default ApplicationRadioButtonFieldset;
