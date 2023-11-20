import { useMemo } from 'react';
import { getFormSyncErrors } from 'redux-form';
import { connect } from 'react-redux';
import { ErrorSummary } from 'hds-react';
import { useTranslation } from 'react-i18next';

import { RootState } from '../../root/rootReducer';
import { Form, FormSection } from '../../plotSearch/types';
import { get } from '../helpers';

type ErrorsSection = {
  fields?: Record<string, { value: string }>;
  sections?: ErrorsSections;
};

type ErrorsSections = Record<string, Array<ErrorsSection> | ErrorsSection>;

type ErrorsRoot = {
  sections?: ErrorsSections;
  fields?: Record<string, string>;
};

interface State {
  errors: ErrorsRoot;
}

interface Props {
  formName: string;
  baseForm: Form;
  isSaveClicked: boolean;
  pathPrefix: string;
}

interface InnerProps extends State, Props {}

const ApplicationErrorsSummary = ({
  errors,
  baseForm,
  isSaveClicked,
}: InnerProps): JSX.Element | null => {
  const { t } = useTranslation();

  const parsedErrors = useMemo<Array<{ label: string; error: string }>>(() => {
    const result: Array<{ label: string; error: string }> = [];

    if (!(errors as Record<string, unknown>).sections) {
      return [];
    }

    const recurseSectionItem = (
      errorNode: ErrorsSection,
      section: FormSection
    ) => {
      if (!errorNode) {
        return;
      }

      section.fields.forEach((field) => {
        if (errorNode.fields?.[field.identifier]) {
          result.push({
            label: `${section.title} - ${field.label}`,
            error: errorNode.fields[field.identifier].value,
          });
        }
      });
      section.subsections.forEach((subsection) =>
        recurseSection(errorNode.sections?.[subsection.identifier], subsection)
      );
    };

    const recurseSection = (
      errorNode: Array<ErrorsSection> | ErrorsSection | undefined,
      section: FormSection
    ) => {
      if (!errorNode) {
        return;
      }

      if (errorNode instanceof Array && section.add_new_allowed) {
        errorNode.forEach((node) => recurseSectionItem(node, section));
      } else if (!(errorNode instanceof Array) && !section.add_new_allowed) {
        recurseSectionItem(errorNode, section);
      }
    };

    baseForm.sections.forEach((section) =>
      recurseSection(errors.sections?.[section.identifier], section)
    );
    return result;
  }, [errors]);

  if (parsedErrors.length === 0 || !isSaveClicked) {
    return null;
  }

  return (
    <div className="ApplicationErrorsSummary">
      <ErrorSummary
        label={t(
          'application.error.summary.header',
          'Please correct these fields before proceeding.'
        )}
      >
        <ul>
          {parsedErrors.map((error, index) => (
            <li key={index}>
              <strong>{error.label}</strong>: {error.error}
            </li>
          ))}
        </ul>
      </ErrorSummary>
    </div>
  );
};

export default connect((state: RootState, props: Props): State => {
  return {
    errors:
      get(getFormSyncErrors(props.formName)(state), props.pathPrefix) ||
      ({} as ErrorsRoot),
  };
})(ApplicationErrorsSummary);
