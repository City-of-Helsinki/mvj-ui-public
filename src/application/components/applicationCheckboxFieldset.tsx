import { Checkbox, SelectionGroup } from 'hds-react';
import { FieldRendererProps } from '../types';
import ApplicationExtraTextField from './applicationExtraTextField';
import ApplicationFieldsetHelperText from './applicationFieldsetHelperText';

const ApplicationCheckboxFieldset = (
  props: FieldRendererProps,
): JSX.Element => {
  const { field, id, input, meta, setValues, displayError } = props;

  return (
    <div className="ApplicationCheckboxFieldset">
      {field.choices && field.choices.length > 0 ? (
        <>
          <SelectionGroup
            label={field.label}
            required={field.required}
            errorText={displayError && meta.error?.value}
            className="ApplicationCheckboxFieldset__selection-group"
          >
            {field.choices.map((option, index) => (
              <div
                className="ApplicationCheckboxFieldset__option"
                id={`ApplicationCheckboxFieldSet_${input.name}_${index}_div`}
                key={index}
              >
                <Checkbox
                  id={`ApplicationCheckboxFieldSet_${input.name}_${index}`}
                  checked={input.value?.value?.includes(option.value)}
                  onChange={(event) => {
                    if (event.target.checked) {
                      setValues({
                        value: [...(input?.value?.value || []), option.value],
                      });
                    } else {
                      setValues({
                        value: (input.value?.value || []).filter(
                          (v: string | number) => v !== option.value,
                        ),
                        // If the item in control of the extra value was unselected, clear that value as well.
                        extraValue: option.has_text_input
                          ? ''
                          : input.value?.extraValue,
                      });
                    }
                  }}
                  onBlur={() => input.onBlur(input.value)}
                  label={option.text}
                />
                {option.has_text_input && (
                  <ApplicationExtraTextField
                    {...props}
                    parentId={`ApplicationRadiobuttonFieldSet_${id}_${index}`}
                    disabled={!input.value?.value?.includes(option.value)}
                  />
                )}
              </div>
            ))}
          </SelectionGroup>
          <ApplicationFieldsetHelperText>
            {field.hint_text}
          </ApplicationFieldsetHelperText>
        </>
      ) : (
        <>
          <Checkbox
            id={`ApplicationCheckboxFieldSet_${id}`}
            checked={
              input.value.value instanceof Array ? false : input.value.value
            }
            required={field.required}
            errorText={displayError && meta.error?.value}
            label={field.label}
            onChange={(e) => setValues({ value: e.target.checked })}
            onBlur={() => input.onBlur(input.value)}
          />
          <ApplicationFieldsetHelperText>
            {field.hint_text}
          </ApplicationFieldsetHelperText>
        </>
      )}
    </div>
  );
};

export default ApplicationCheckboxFieldset;
