import { Col, Row } from 'react-grid-system';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { RootState } from '../../root/rootReducer';
import { getFieldTypeMapping } from '../selectors';
import { FormField } from '../../plotSearch/types';
import {
  ApplicationField,
  FieldTypeMapping,
  SupportedFieldTypes,
  UploadedFileMeta,
} from '../types';

interface State {
  fieldTypeMapping: FieldTypeMapping;
}

interface Props extends State {
  field: FormField;
  sectionAnswers: Record<string, ApplicationField>;
  pendingUploads: UploadedFileMeta[];
}

const ApplicationPreviewSubsectionField = ({
  field,
  sectionAnswers,
  fieldTypeMapping,
  pendingUploads,
}: Props): JSX.Element | null => {
  const { t } = useTranslation();

  const getDisplayValue = (): string | null => {
    if (!field.enabled) {
      return null;
    }

    const value = sectionAnswers[field.identifier]?.value;
    let displayValue = '' + value;
    switch (fieldTypeMapping[field.type]) {
      case SupportedFieldTypes.TextField:
      case SupportedFieldTypes.TextArea:
        // plain text with no special handling
        if (!value) {
          displayValue = '-';
          break;
        }
        break;
      case SupportedFieldTypes.SelectField:
      case SupportedFieldTypes.RadioButton:
      case SupportedFieldTypes.RadioButtonInline:
        {
          if (!value) {
            displayValue = '-';
            break;
          }

          const optionItem = field.choices.find(
            (choice) => choice.value === value,
          );
          if (optionItem) {
            displayValue = optionItem.text;
            if (optionItem.has_text_input) {
              displayValue += ` (${sectionAnswers[field.identifier]
                ?.extraValue})`;
            }
          } else {
            // should not happen
            displayValue = '?';
          }
        }
        break;
      case SupportedFieldTypes.Checkbox:
        if (Array.isArray(value)) {
          if (value.length === 0) {
            displayValue = '-';
            break;
          }

          displayValue = value
            .map((singleValue) => {
              const optionItem = field.choices.find(
                (choice) => choice.value === singleValue,
              );
              let optionText;
              if (optionItem) {
                optionText = optionItem.text;
                if (optionItem.has_text_input) {
                  optionText += ` (${sectionAnswers[field.identifier]
                    ?.extraValue})`;
                }
              } else {
                // should not happen
                optionText = '?';
              }

              return optionText;
            })
            .join(', ');
        } else {
          displayValue = (
            value
              ? t('application.preview.booleanYes', 'Yes')
              : t('application.preview.booleanNo', 'No')
          ) as string;
        }
        break;
      case SupportedFieldTypes.FileUpload:
        displayValue = pendingUploads
          .filter((upload) =>
            (value instanceof Array ? (value as Array<number>) : []).includes(
              upload.id,
            ),
          )
          .map(
            (file, i) =>
              `${t(
                'application.preview.attachmentNo',
                'Attachment #{{number}}',
                {
                  number: i + 1,
                },
              )} (${file.name})`,
          )
          .join(', ');
        break;
      default:
        // treat unknown types as plain text
        break;
    }

    return displayValue;
  };

  if (!field.enabled) {
    return null;
  }

  return (
    <dl className="ApplicationPreviewSubsectionField">
      <Row key={field.id} className="ApplicationPreviewSubsectionField__row">
        <Col component="dt" xs={4}>
          {field.label}
        </Col>
        <Col component="dd" xs={8}>
          {getDisplayValue() || '-'}
        </Col>
      </Row>
    </dl>
  );
};

export default connect(
  (state: RootState): State => ({
    fieldTypeMapping: getFieldTypeMapping(state),
  }),
  {},
)(ApplicationPreviewSubsectionField);
