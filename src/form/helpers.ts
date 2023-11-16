export interface ReduxFormError
  extends Record<string, ReduxFormError | Array<ReduxFormError> | string> {}

export const getFieldNamesFromFormErrors = (
  errors: ReduxFormError,
  root = '',
): Array<string> =>
  (Object.keys(errors) as Array<keyof typeof errors>).reduce<Array<string>>(
    (acc, key) => {
      const item = errors[key];
      if (Object.getPrototypeOf(item) === Object.prototype) {
        acc.push(
          ...getFieldNamesFromFormErrors(
            item as ReduxFormError,
            (root ? root + '.' : '') + key,
          ),
        );
      } else if (Array.isArray(item)) {
        item.forEach((subItem, i) =>
          acc.push(
            ...getFieldNamesFromFormErrors(
              subItem,
              `${root ? root + '.' : ''}.${key}[${i}]`,
            ),
          ),
        );
      } else {
        acc.push((root ? root + '.' : '') + key);
      }
      return acc;
    },
    [],
  );
