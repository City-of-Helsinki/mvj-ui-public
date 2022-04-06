import React, { useEffect, useState } from 'react';
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

// TODO: Fix dirty hacks that work around the complications stemming from the fact that this component
//  has to juggle both single and multiple values depending on whether the multiselect prop was passed in.
//  - Explicit function type recast in onChangeHandler because of the selected value resolving to
//    OptionType & Array<OptionType> (both a single item and an array simultaneously)
//  - Internal value passed as an any type, again because something demands that the value has to
//    exhibit properties of both at the same time
//  A similar case was discussed in Slack on Feb 11, 2022 (keyword: multiselect)
//  and no good solution was found at that time. That project elected to create separate
//  single and multiple select components instead.
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

  // When the list of available options changes, the current selection should be re-evaluated to make sure
  // any invalidated options no longer remain in use.
  useEffect(() => {
    if (!internalValue) {
      return;
    }

    if (Array.isArray(internalValue)) {
      onChangeHandler(
        options.filter((option) =>
          internalValue.some(
            (singleValue) =>
              singleValue.value && option.label === singleValue.label
          )
        )
      );
    } else {
      onChangeHandler(
        options.find(
          (option) =>
            option.value === internalValue.value &&
            option.label === internalValue.label
        )
      );
    }
  }, [options]);

  const onChangeHandler = (
    selected: Array<OptionType> | OptionType | undefined
  ): void => {
    setInternalValue(selected);

    if (onChange) {
      (
        onChange as (
          selected: Array<OptionType> | OptionType | undefined
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
