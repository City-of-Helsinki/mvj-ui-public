import React, { useCallback } from 'react';
import { Col, Row, ScreenClassMap } from 'react-grid-system';
import {
  Field,
  FieldArray,
  WrappedFieldArrayProps,
  WrappedFieldProps,
} from 'redux-form';
import { connect } from 'react-redux';
import { Button, IconCrossCircle, IconPlusCircle } from 'hds-react';
import { useTranslation } from 'react-i18next';

import { FormField, FormSection } from '../../plotSearch/types';
import {
  ApplicationFormNode,
  ApplicationFormTopLevelSectionFlavor,
  ApplicationSectionKeys,
  FieldRendererProps,
  FieldTypeMapping,
  FieldValue,
  SupportedFieldTypes,
} from '../types';
import ApplicationFileUploadField from './applicationFileUploadField';
import ApplicationTextField from './applicationTextField';
import ApplicationTextArea from './applicationTextArea';
import ApplicationSelectField from './applicationSelectField';
import ApplicationCheckboxFieldset from './applicationCheckboxFieldset';
import ApplicationRadioButtonFieldset from './applicationRadioButtonFieldset';
import { RootState } from '../../root/rootReducer';
import { getFieldTypeMapping } from '../selectors';
import { getSectionFavouriteTarget, getSectionTemplate } from '../helpers';
import { removeFavouriteTarget } from '../../favourites/actions';
import classNames from 'classnames';
import ApplicationFormTargetSummary from './ApplicationFormTargetSummary';

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
  flavor?: ApplicationFormTopLevelSectionFlavor;
}

interface ApplicationFormSubsectionFieldArrayInnerProps {
  removeFavouriteTarget: (id: number) => void;
}

const ApplicationFormSubsectionFieldArray = connect(null, {
  removeFavouriteTarget,
})(
  ({
    fields,
    section,
    headerTag: HeaderTag,
    flavor,
    removeFavouriteTarget,
  }: WrappedFieldArrayProps<ApplicationFormNode> &
    ApplicationFormSubsectionFieldArrayProps &
    ApplicationFormSubsectionFieldArrayInnerProps): JSX.Element => {
    const { t } = useTranslation();
    const isTargetRoot = flavor === ApplicationFormTopLevelSectionFlavor.TARGET;

    return (
      <div
        className={classNames('ApplicationFormSubsectionFieldArray', {
          [`ApplicationFormSubsectionFieldArray--${flavor}`]: !!flavor,
          'ApplicationFormSubsectionFieldArray--top-level': !!flavor,
        })}
      >
        {fields.map((identifier, i) => {
          const targetId = fields.get(i).metadata?.identifier as
            | number
            | undefined;
          const target = getSectionFavouriteTarget(targetId);

          const removeItem = (): void => {
            if (isTargetRoot) {
              if (targetId) {
                removeFavouriteTarget(targetId);
                fields.remove(i);
              }
            } else {
              fields.remove(i);
            }
          };

          let headerText: React.ReactNode;
          switch (flavor) {
            case ApplicationFormTopLevelSectionFlavor.APPLICANT:
              headerText = t(
                'application.arraySection.applicantHeader',
                'Details of applicant {{number}}',
                { number: i + 1 }
              );
              break;
            case ApplicationFormTopLevelSectionFlavor.TARGET:
              headerText = `${
                target?.plot_search_target.lease_identifier || '?'
              } - ${target?.plot_search_target.lease_address.address || '?'}, ${
                target?.plot_search_target.district || '?'
              }`;
              break;
            default:
              headerText = `${section.title} (${i + 1})`;
          }

          return (
            <div
              className="ApplicationFormSubsectionFieldArray__item"
              key={identifier}
            >
              <div className="ApplicationFormSubsectionFieldArray__item-content">
                <HeaderTag>{headerText}</HeaderTag>
                {(fields.length > 1 || isTargetRoot) && (
                  <Button
                    className="ApplicationFormSubsectionFieldArray__remove-button"
                    onClick={removeItem}
                    variant="supplementary"
                    iconLeft={<IconCrossCircle />}
                  >
                    {isTargetRoot
                      ? t('application.arraySection.remove', 'Remove')
                      : t(
                          'application.arraySection.removeTarget',
                          'Remove from list'
                        )}
                  </Button>
                )}
                {isTargetRoot && (
                  <ApplicationFormTargetSummary target={target} />
                )}
                <ApplicationFormSubsectionFields
                  section={section}
                  identifier={identifier}
                />
              </div>
            </div>
          );
        })}
        {!isTargetRoot && (
          <Button
            className="ApplicationFormSubsectionFieldArray__add-button"
            onClick={() => fields.push(getSectionTemplate(section.identifier))}
            variant="supplementary"
            iconLeft={<IconPlusCircle />}
          >
            {section.add_new_text ||
              t('application.arraySection.genericAddNew', 'Add new')}
          </Button>
        )}
      </div>
    );
  }
);

interface ApplicationFormSubsectionProps {
  path: Array<string>;
  section: FormSection;
  headerTag?: React.ElementType;
  flavor?: ApplicationFormTopLevelSectionFlavor;
}

const ApplicationFormSubsection = ({
  path,
  section,
  headerTag: HeaderTag = 'h3',
  flavor = ApplicationFormTopLevelSectionFlavor.GENERAL,
}: ApplicationFormSubsectionProps): JSX.Element | null => {
  if (!section.visible) {
    return null;
  }

  const isArray = section.add_new_allowed;
  const pathName = [...path, section.identifier].join('.');

  return (
    <div
      className={classNames(
        'ApplicationFormSubsection',
        `ApplicationFormSubsection--${flavor}`
      )}
    >
      {isArray ? (
        <FieldArray<
          ApplicationFormSubsectionFieldArrayProps,
          ApplicationFormNode
        >
          name={pathName}
          component={ApplicationFormSubsectionFieldArray}
          props={{ section, headerTag: HeaderTag }}
          flavor={flavor}
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
