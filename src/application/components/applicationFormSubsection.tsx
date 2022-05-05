import React, { useCallback } from 'react';
import { Col, Row, ScreenClassMap } from 'react-grid-system';
import {
  Field,
  FieldArray,
  WrappedFieldArrayProps,
  WrappedFieldProps,
} from 'redux-form';
import { connect } from 'react-redux';
import { Button, IconPlusCircle, IconTrash } from 'hds-react';
import { useTranslation } from 'react-i18next';

import { FormField, FormSection } from '../../plotSearch/types';
import {
  FieldRendererProps,
  FieldTypeMapping,
  FieldValue,
  NestedField,
  SupportedFieldTypes,
  ApplicationSectionKeys,
} from '../types';
import ApplicationFileUploadField from './applicationFileUploadField';
import ApplicationTextField from './applicationTextField';
import ApplicationTextArea from './applicationTextArea';
import ApplicationSelectField from './applicationSelectField';
import ApplicationCheckboxFieldset from './applicationCheckboxFieldset';
import ApplicationRadioButtonFieldset from './applicationRadioButtonFieldset';
import { RootState } from '../../root/rootReducer';
import { getFieldTypeMapping } from '../selectors';
import { getSectionTemplate } from '../helpers';

interface ApplicationFormFieldProps {
  name?: string | undefined;
  field: FormField;
  fieldType: SupportedFieldTypes;
  columnWidths: ScreenClassMap<number>;
  innerComponent: React.FC<FieldRendererProps>;
}

const ApplicationFormField = ({
  input,
  field,
  fieldType,
  columnWidths,
  innerComponent: Component,
  ...props
}: ApplicationFormFieldProps & WrappedFieldProps) => {
  const setValues = (newValues: {
    value?: FieldValue;
    extraValue?: FieldValue;
  }) => {
    input.onChange({
      ...input.value,
      ...newValues,
    });
  };

  return (
    <Col {...columnWidths} className="ApplicationFormField">
      <Component
        id={field.id.toString()}
        field={field}
        input={input}
        setValues={setValues}
        fieldType={fieldType}
        {...props}
      />
    </Col>
  );
};

interface ApplicationFormSubsectionFieldsState {
  fieldTypeMapping: FieldTypeMapping;
}

interface ApplicationFormSubsectionFieldsProps {
  section: FormSection;
  fieldTypeMapping: FieldTypeMapping;
  identifier: string;
}

const ApplicationFormSubsectionFields = connect(
  (state: RootState): ApplicationFormSubsectionFieldsState => ({
    fieldTypeMapping: getFieldTypeMapping(state),
  })
)(
  ({
    section,
    fieldTypeMapping,
    identifier,
  }: ApplicationFormSubsectionFieldsProps) => {
    const renderField = useCallback((pathName: string, field: FormField) => {
      /*
       * All usages of field components are created here, so this is a fitting place
       * for some footnotes about them as a whole.
       *
       * The options available for each field allow for a wide variety of display styles
       * for each field type. This complexity is not easy to map back to sensible data
       * models for either the UI or for the saved answers, though, so some edge cases
       * are deliberately not supported and may misbehave if put into use regardless.
       *
       * These include:
       * - Multiple options in a checkbox or radio button group that have an extra
       *   text input attached. Only one such option should have one; if multiple are
       *   present, the inputs will all modify the same value.
       * - Extra inputs on options for dropdown selectors. No input will be shown.
       * - Options specified for non-option field types such as text fields.
       *   The options will have no effect.
       * */

      if (!field.enabled) {
        return null;
      }

      const fieldName = [
        pathName,
        ApplicationSectionKeys.Fields,
        field.identifier,
      ].join('.');
      const fieldType = fieldTypeMapping[field.type];

      // Special cases that use a different submission path and thus different props
      if (fieldType === SupportedFieldTypes.FileUpload) {
        return (
          <Col xs={12} sm={12} md={12} lg={12} xl={12}>
            <ApplicationFileUploadField
              id={field.id.toString()}
              field={field}
            />
          </Col>
        );
      }

      let component: React.FC<FieldRendererProps>;
      let columnWidths: ScreenClassMap<number> = {
        xs: 12,
        sm: 12,
        md: 6,
        lg: 6,
        xl: 3,
      };

      switch (fieldType) {
        case SupportedFieldTypes.TextField:
          component = ApplicationTextField;
          break;
        case SupportedFieldTypes.TextArea:
          component = ApplicationTextArea;
          columnWidths = {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 12,
            xl: 12,
          };
          break;
        case SupportedFieldTypes.SelectField:
          component = ApplicationSelectField;
          break;
        case SupportedFieldTypes.Checkbox:
          component = ApplicationCheckboxFieldset;
          columnWidths = {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 12,
            xl: 12,
          };
          break;
        case SupportedFieldTypes.RadioButton:
        case SupportedFieldTypes.RadioButtonInline:
          component = ApplicationRadioButtonFieldset;
          columnWidths = {
            xs: 12,
            sm: 12,
            md: 12,
            lg: 12,
            xl: 12,
          };
          break;
        default:
          component = function RenderedUnimplementedPlaceholder() {
            return <span>component type {field.type} not implemented</span>;
          };
      }

      return (
        <Field
          name={fieldName}
          component={ApplicationFormField}
          field={field}
          fieldType={
            (fieldTypeMapping[field.type] as SupportedFieldTypes) || null
          }
          columnWidths={columnWidths}
          innerComponent={component}
        />
      );
    }, []);

    return (
      <>
        <Row>
          {section.fields.map((field) => renderField(identifier, field))}
        </Row>
        {section.subsections.map((subsection) => (
          <ApplicationFormSubsection
            path={[identifier, ApplicationSectionKeys.Subsections]}
            section={subsection}
            key={subsection.id}
          />
        ))}
      </>
    );
  }
);

interface ApplicationFormSubsectionFieldArrayProps {
  section: FormSection;
  headerTag: React.ElementType;
}

const ApplicationFormSubsectionFieldArray = ({
  fields,
  section,
  headerTag: HeaderTag,
}: WrappedFieldArrayProps<NestedField> &
  ApplicationFormSubsectionFieldArrayProps): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="ApplicationFormSubsectionFieldArray">
      {fields.map((identifier, i) => (
        <div
          className="ApplicationFormSubsectionFieldArray__item"
          key={identifier}
        >
          <div className="ApplicationFormSubsectionFieldArray__item-content">
            <HeaderTag>
              {section.title} ({i + 1})
            </HeaderTag>
            {fields.length > 1 && (
              <Button
                className="ApplicationFormSubsectionFieldArray__remove-button"
                onClick={() => fields.remove(i)}
                variant="supplementary"
                iconLeft={<IconTrash />}
              >
                {t('application.arraySection.remove', 'Remove')}
              </Button>
            )}
            <ApplicationFormSubsectionFields
              section={section}
              identifier={identifier}
            />
          </div>
        </div>
      ))}
      <Button
        className="ApplicationFormSubsectionFieldArray__add-button"
        onClick={() => fields.push(getSectionTemplate(section.identifier))}
        variant="supplementary"
        iconLeft={<IconPlusCircle />}
      >
        {section.add_new_text ||
          t('application.arraySection.genericAddNew', 'Add new')}
      </Button>
    </div>
  );
};

interface ApplicationFormSubsectionProps {
  path: Array<string>;
  section: FormSection;
  headerTag?: React.ElementType;
}

const ApplicationFormSubsection = ({
  path,
  section,
  headerTag: HeaderTag = 'h3',
}: ApplicationFormSubsectionProps): JSX.Element | null => {
  if (!section.visible) {
    return null;
  }

  const isArray = section.add_new_allowed;
  const pathName = [...path, section.identifier].join('.');

  return (
    <div className="ApplicationFormSubsection">
      {isArray ? (
        <FieldArray<ApplicationFormSubsectionFieldArrayProps, NestedField>
          name={pathName}
          component={ApplicationFormSubsectionFieldArray}
          props={{ section, headerTag: HeaderTag }}
        />
      ) : (
        <div className="ApplicationFormSubsection__content">
          <HeaderTag>{section.title}</HeaderTag>
          <ApplicationFormSubsectionFields
            section={section}
            identifier={pathName}
          />
        </div>
      )}
    </div>
  );
};

export default ApplicationFormSubsection;
