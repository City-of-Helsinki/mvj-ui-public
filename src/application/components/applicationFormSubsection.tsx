import React, { Fragment, useCallback, useEffect } from 'react';
import { Col, Row, ScreenClassMap } from 'react-grid-system';
import {
  change,
  Field,
  FieldArray,
  WrappedFieldArrayProps,
  WrappedFieldProps,
} from 'redux-form';
import { connect } from 'react-redux';
import { Button, IconCrossCircle, IconPlusCircle } from 'hds-react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';

import { FormField, FormSection, TargetPlanType } from '../../plotSearch/types';
import {
  APPLICANT_SECTION_IDENTIFIER,
  APPLICANT_TYPE_FIELD_IDENTIFIER,
  ApplicantTypes,
  ApplicationField,
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
import ApplicationFractionalFieldset from './applicationFractionalFieldset';
import ApplicationHiddenField from './applicationHiddenField';
import { RootState } from '../../root/rootReducer';
import { getFieldTypeMapping } from '../selectors';
import {
  getSectionApplicantType,
  getSectionFavouriteTarget,
  getSectionTemplate,
  getFieldValue,
  valueToApplicantType,
} from '../helpers';
import { removeFavouriteTarget } from '../../favourites/actions';
import ApplicationFormTargetSummary from './ApplicationFormTargetSummary';

interface ApplicationFormFieldProps {
  name?: string | undefined;
  field: FormField;
  fieldType: SupportedFieldTypes;
  columnWidths: ScreenClassMap<number>;
  innerComponent: React.FC<FieldRendererProps>;
  onValueChange?: (newValues: Partial<ApplicationField>) => void;
  isSaveClicked?: boolean;
}

const ApplicationFormField = ({
  input,
  field,
  meta,
  fieldType,
  columnWidths,
  innerComponent: Component,
  onValueChange,
  isSaveClicked,
  ...props
}: ApplicationFormFieldProps & WrappedFieldProps) => {
  const setValues = (newValues: Partial<ApplicationField>) => {
    input.onChange({
      ...input.value,
      ...newValues,
    });
    if (onValueChange) {
      onValueChange(newValues);
    }
  };

  return (
    <Col {...columnWidths} className="ApplicationFormField">
      <Component
        id={field.id.toString()}
        field={field}
        input={input}
        meta={meta}
        setValues={setValues}
        fieldType={fieldType}
        displayError={meta.touched || isSaveClicked === true}
        {...props}
      />
    </Col>
  );
};

interface ApplicationFormSubsectionFieldsProps {
  section: FormSection;
  identifier: string;
  formName: string;
  isSaveClicked?: boolean;
}

interface ApplicationFormSubsectionFieldsInnerProps {
  fieldTypeMapping: FieldTypeMapping;
  sectionApplicantType: ApplicantTypes;
  change: typeof change;
  getValue: (identifier: string) => FieldValue;
  isSaveClicked?: boolean;
}

const ApplicationFormSubsectionFields = connect(
  (state: RootState, props: ApplicationFormSubsectionFieldsProps) => ({
    fieldTypeMapping: getFieldTypeMapping(state),
    sectionApplicantType: getSectionApplicantType(
      state,
      props.section,
      props.identifier,
      props.formName,
    ),
    getValue: (fieldIdentifier: string): FieldValue =>
      getFieldValue(state, fieldIdentifier, props.formName),
  }),
  {
    change,
  },
)(({
  formName,
  section,
  fieldTypeMapping,
  identifier,
  change,
  sectionApplicantType,
  getValue,
  isSaveClicked,
}: ApplicationFormSubsectionFieldsProps &
  ApplicationFormSubsectionFieldsInnerProps) => {
  const renderField = useCallback(
    (pathName: string, field: FormField, isSaveClicked?: boolean) => {
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

      useEffect(() => {
        // set default value if exists and current value is empty
        if (
          field.default_value !== null &&
          !getValue(`${identifier}.fields.${field.identifier}.value`)
        ) {
          change(
            formName,
            `${identifier}.fields.${field.identifier}.value`,
            field.default_value,
          );
          // set the metadata correctly for the section to render
          if (field.identifier == APPLICANT_TYPE_FIELD_IDENTIFIER) {
            change(
              formName,
              `${identifier}.metadata.applicantType`,
              valueToApplicantType(field.default_value as string),
            );
          }
        }
      }, []);

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
              fieldName={fieldName}
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
        case SupportedFieldTypes.Hidden:
          component = ApplicationHiddenField;
          break;
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
        case SupportedFieldTypes.FractionalField:
          component = ApplicationFractionalFieldset;
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
          onValueChange={(newValues: Partial<ApplicationField>) =>
            checkSpecialValues(field, newValues)
          }
          isSaveClicked={isSaveClicked}
        />
      );
    },
    [identifier],
  );

  const checkSpecialValues = (
    field: FormField,
    newValues: Partial<ApplicationField>
  ) => {
    if (
      section.identifier === APPLICANT_SECTION_IDENTIFIER &&
      field.identifier === APPLICANT_TYPE_FIELD_IDENTIFIER &&
      newValues.value !== undefined
    ) {
      change(
        formName,
        `${identifier}.metadata.applicantType`,
        valueToApplicantType(newValues.value as string)
      );
    }
  };

  return (
    <>
      <Row>
        {section.fields.map((field) => (
          <Fragment key={field.identifier}>
            {renderField(identifier, field, isSaveClicked)}
          </Fragment>
        ))}
      </Row>
      {section.subsections.map((subsection) => (
        <ApplicationFormSubsection
          formName={formName}
          path={[identifier, ApplicationSectionKeys.Subsections]}
          section={subsection}
          key={subsection.id}
          parentApplicantType={sectionApplicantType}
          isSaveClicked={isSaveClicked}
        />
      ))}
    </>
  );
});

interface ApplicationFormSubsectionFieldArrayProps {
  formName: string;
  section: FormSection;
  headerTag: React.ElementType;
  flavor?: ApplicationFormTopLevelSectionFlavor;
  path: Array<string>;
  isSaveClicked?: boolean;
}

interface ApplicationFormSubsectionFieldArrayInnerProps {
  removeFavouriteTarget: (id: number) => void;
}

const ApplicationFormSubsectionFieldArray = connect(null, {
  removeFavouriteTarget,
})(({
  formName,
  fields,
  section,
  headerTag: HeaderTag,
  flavor,
  removeFavouriteTarget,
  path,
  isSaveClicked,
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
              { number: i + 1 },
            );
            break;
          case ApplicationFormTopLevelSectionFlavor.TARGET:
            headerText =
              target?.plot_search_target.target_plan_type ===
              TargetPlanType.PlanUnit
                ? `${target?.plot_search_target.lease_identifier || '?'} - ${
                    target?.plot_search_target.lease_address?.address || '?'
                  }, ${target?.plot_search_target.district?.name || '?'}`
                : `${target?.plot_search_target.target_plan.address || '?'}`;
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
                        'Remove from list',
                      )}
                </Button>
              )}
              {isTargetRoot && <ApplicationFormTargetSummary target={target} />}
              <ApplicationFormSubsectionFields
                formName={formName}
                section={section}
                identifier={identifier}
                isSaveClicked={isSaveClicked}
              />
            </div>
          </div>
        );
      })}
      {!isTargetRoot && (
        <Button
          className="ApplicationFormSubsectionFieldArray__add-button"
          onClick={() =>
            fields.push(
              getSectionTemplate(
                section.identifier,
                formName,
                path.slice(0, -1).join('.'),
              ),
            )
          }
          variant="supplementary"
          iconLeft={<IconPlusCircle />}
        >
          {section.add_new_text ||
            t('application.arraySection.genericAddNew', 'Add new')}
        </Button>
      )}
    </div>
  );
});

interface ApplicationFormSubsectionProps {
  formName: string;
  path: Array<string>;
  section: FormSection;
  headerTag?: React.ElementType;
  flavor?: ApplicationFormTopLevelSectionFlavor;
  parentApplicantType?: ApplicantTypes;
  isSaveClicked?: boolean;
}

const ApplicationFormSubsection = ({
  formName,
  path,
  section,
  headerTag: HeaderTag = 'h3',
  flavor = ApplicationFormTopLevelSectionFlavor.GENERAL,
  parentApplicantType,
  isSaveClicked,
}: ApplicationFormSubsectionProps): JSX.Element | null => {
  if (!section.visible) {
    return null;
  }

  if (parentApplicantType === ApplicantTypes.UNSELECTED) {
    return null;
  }

  if (
    parentApplicantType !== ApplicantTypes.NOT_APPLICABLE &&
    !(
      [
        ApplicantTypes.UNKNOWN,
        ApplicantTypes.BOTH,
        parentApplicantType,
      ] as Array<ApplicantTypes | null>
    ).includes(section.applicant_type)
  ) {
    return null;
  }

  const isArray = section.add_new_allowed;
  const pathName = [...path, section.identifier].join('.');

  return (
    <div
      className={classNames(
        'ApplicationFormSubsection',
        `ApplicationFormSubsection--${flavor}`,
      )}
    >
      {isArray ? (
        <FieldArray<
          ApplicationFormSubsectionFieldArrayProps,
          ApplicationFormNode
        >
          name={pathName}
          component={ApplicationFormSubsectionFieldArray}
          props={{
            section,
            headerTag: HeaderTag,
            formName,
            path,
          }}
          flavor={flavor}
          isSaveClicked={isSaveClicked}
        />
      ) : (
        <div className="ApplicationFormSubsection__content">
          <HeaderTag>{section.title}</HeaderTag>
          <ApplicationFormSubsectionFields
            formName={formName}
            section={section}
            identifier={pathName}
            isSaveClicked={isSaveClicked}
          />
        </div>
      )}
    </div>
  );
};

export default ApplicationFormSubsection;
