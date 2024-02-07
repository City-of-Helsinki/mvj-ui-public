import { useEffect, useState } from 'react';
import { SelectProps, Select } from 'hds-react';
import { focus, blur, WrappedFieldProps } from 'redux-form';
import { connect } from 'react-redux';

type Props = {
  focus: typeof focus;
  blur: typeof blur;
};

interface SelectFormFieldOption {
  value: unknown;
  label: string;
}

// The HDS Select component type requires the inclusion of both OptionType (single select) and Array<OptionType> (multiselect)
// But this implementation only supports single selects.
// TODO: Implement a working multiselect logic when it is needed. Currently (Feb 2024), there is no need for it.
const SelectFormField = <OptionType extends SelectFormFieldOption>({
  input,
  meta,
  onChange,
  focus,
  blur,
  options,
  ...rest
}: WrappedFieldProps & Props & SelectProps<OptionType>): JSX.Element => {
  // The onFocus and onBlur callbacks of Select are incompatible with Redux Form as is, so we need to work around them.
  // In particular, the onFocus prop that RF provides expects a FocusEvent as an argument, but Select provides no
  // arguments to that callback at all.
  const { onFocus, onBlur, value, ...inputProps } = input;

  const getOptionWithValue = (value: OptionType): OptionType | undefined =>
    options.find((option) => value === option.value);

  const [internalValue, setInternalValue] = useState<
    Array<OptionType> | OptionType | null | undefined
  >(() => {
    if (Array.isArray(input.value)) {
      return input.value
        .map((singleValue) => getOptionWithValue(singleValue))
        .filter((value) => value !== undefined) as Array<OptionType>;
    } else {
      return getOptionWithValue(input.value);
    }
  });

  const onChangeHandler = (
    selected: Array<OptionType> | OptionType | undefined,
  ): void => {
    setInternalValue(selected);

    if (onChange) {
      (
        onChange as (
          selected: Array<OptionType> | OptionType | undefined,
        ) => void
      )(selected);
    }

    if (Array.isArray(selected)) {
      input.onChange(selected.map((option) => option.value));
    } else {
      input.onChange(selected?.value || null);
    }
  };

  const onFocusHandler = (): void => {
    focus(meta.form, input.name);
  };

  const onBlurHandler = (): void => {
    blur(meta.form, input.name, input.value, true);
  };

  return (
    <Select<OptionType>
      {...inputProps}
      onFocus={onFocusHandler}
      onBlur={onBlurHandler}
      onChange={onChangeHandler}
      options={options}
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      value={internalValue || (null as any)}
      invalid={meta.touched && meta.invalid}
      error={meta.touched && meta.error}
      {...rest}
    />
  );
};

export default connect(null, {
  focus,
  blur,
})(SelectFormField);
