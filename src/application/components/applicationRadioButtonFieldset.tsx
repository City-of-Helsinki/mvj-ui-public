import React from 'react';
import { RadioButton, SelectionGroup } from 'hds-react';
import { FieldRendererProps, SupportedFieldTypes } from '../types';
import ApplicationExtraTextField from './applicationExtraTextField';
import ApplicationFieldsetHelperText from './applicationFieldsetHelperText';
import classNames from 'classnames';

const ApplicationRadioButtonFieldset = (
  props: FieldRendererProps
): JSX.Element => {
  const { id, input, field, fieldType, setValue } = props;

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
          `ApplicationRadioButtonFieldset__selection-group--${orientation}`
        )}
      >
        {field.choices.map((option, index) => (
          <div className="ApplicationRadioButtonFieldset__option" key={index}>
            <RadioButton
              id={`ApplicationRadiobuttonFieldSet_${id}_${index}`}
              checked={input.value.value === option.value}
              value={input.value.value}
              onChange={() => setValue(option.value)}
              required={field.required}
              label={option.text}
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
        <ApplicationFieldsetHelperText>
          {field.hint_text}
        </ApplicationFieldsetHelperText>
      </SelectionGroup>
    </div>
  );
};

export default ApplicationRadioButtonFieldset;
