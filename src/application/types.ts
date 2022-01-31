import { WrappedFieldProps } from 'redux-form';

import { ApiAttributes } from '../api/types';
import { FormField } from '../plotSearch/types';

// A type definition cannot contain circular references, but an interface definition can,
// thus this is implemented this way.
// eslint-disable-next-line @typescript-eslint/no-empty-interface
export interface NestedField
  extends Record<
    string,
    string | number | boolean | null | NestedField | Array<NestedField>
  > {}

export type FieldTypeMapping = Record<number, string>;

export enum SupportedFieldTypes {
  TextField = 'textbox',
  TextArea = 'textarea',
  SelectField = 'dropdown',
  Checkbox = 'checkbox',
  RadioButton = 'radiobutton',
  RadioButtonInline = 'radiobuttoninline',
  FileUpload = 'uploadfiles',
}

export type FieldValue =
  | Array<string | number | boolean>
  | string
  | number
  | boolean
  | null;
export type FieldRendererProps = WrappedFieldProps & {
  id: string;
  field: FormField;
  setValue: (value: FieldValue) => void;
  setExtraValue: (value: FieldValue) => void;
  fieldType: SupportedFieldTypes | null;
};

export enum ApplicationSectionKeys {
  Subsections = 'sections',
  Fields = 'fields',
}

export const FETCH_FORM_ATTRIBUTES = 'application/FETCH_FORM_ATTRIBUTES';
export interface FetchFormAttributesAction {
  type: typeof FETCH_FORM_ATTRIBUTES;
}

export const RECEIVE_FORM_ATTRIBUTES = 'application/RECEIVE_FORM_ATTRIBUTES';
export interface ReceiveFormAttributesAction {
  type: typeof RECEIVE_FORM_ATTRIBUTES;
  payload: ApiAttributes;
}

export const FORM_ATTRIBUTES_NOT_FOUND =
  'application/FORM_ATTRIBUTES_NOT_FOUND';
export interface FormAttributesNotFoundAction {
  type: typeof FORM_ATTRIBUTES_NOT_FOUND;
}

export const APPLICATION_FORM_NAME = 'application';
