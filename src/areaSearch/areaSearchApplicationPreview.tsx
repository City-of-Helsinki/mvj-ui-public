import React, { useEffect, useState } from 'react';
import { Container } from 'react-grid-system';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { Notification, Button } from 'hds-react';
import MainContentElement from '../a11y/MainContentElement';
import { getFieldTypeMapping } from '../application/selectors';
import {
  ApplicationPreparationError,
  ApplicationSectionKeys,
  FieldTypeMapping,
} from '../application/types';
import AuthDependentContent from '../auth/components/authDependentContent';
import BlockLoader from '../loader/blockLoader';
import { getPageTitle } from '../root/helpers';
import { RootState } from '../root/rootReducer';
import AreaSearchTargetSummary from './components/areaSearchTargetSummary';
import {
  AreaSearch,
  AreaSearchApplicationSubmission,
  AreaSearchFormRoot,
  AREA_SEARCH_FORM_NAME,
} from './types';
import { submitAreaSearchApplication } from './actions';
import ApplicationPreviewSubsection from '../application/components/applicationPreviewSubsection';
import { getClientErrorMessage } from '../application/helpers';
import { prepareAreaSearchApplicationForSubmission } from './helpers';

interface State {
  lastSubmission: AreaSearch | null;
  formValues: AreaSearchFormRoot;
  fieldTypeMapping: FieldTypeMapping;
  submittedAnswerId: number;
  lastError: unknown;
}

interface Props extends State {
  submitApplication: (data: AreaSearchApplicationSubmission) => void;
  isSubmitting?: boolean;
  setNextStep: any;
  setPreviousStep: any;
}

const AreaSearchApplicationPreview = ({
  submitApplication,
  lastSubmission,
  formValues,
  lastError,
  isSubmitting = false,
  submittedAnswerId,
  setNextStep,
  setPreviousStep,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const [lastClientError, setLastClientError] =
    useState<ApplicationPreparationError | null>(null);

  const [previousAnswerId] = useState<number>(submittedAnswerId);

  useEffect(() => {
    if (submittedAnswerId !== previousAnswerId) {
      setPreviousStep();
    }
  }, [submittedAnswerId]);

  const submit = () => {
    try {
      setLastClientError(null);
      submitApplication(
        prepareAreaSearchApplicationForSubmission(AREA_SEARCH_FORM_NAME)
      );
    } catch (e) {
      setLastClientError(e as ApplicationPreparationError);
    }
  };

  const renderSectionPreviewsOrGoBack = (loggedIn: boolean) => {
    if (
      loggedIn &&
      lastSubmission?.form?.sections &&
      formValues.form[ApplicationSectionKeys.Subsections]
    ) {
      return lastSubmission.form.sections.map((section) => (
        <ApplicationPreviewSubsection
          key={section.identifier}
          section={section}
          answers={
            formValues.form[ApplicationSectionKeys.Subsections][
              section.identifier
            ]
          }
          headerTag={'h2'}
          pendingUploads={[]}
        />
      ));
    } else {
      setPreviousStep();
    }
  };

  return (
    <AuthDependentContent>
      {(loading, loggedIn) => (
        <MainContentElement className="ApplicationPreviewPage">
          <Helmet>
            <title>
              {getPageTitle(
                t(
                  'areaSearch.application.preview.pageTitle',
                  'Area search application'
                )
              )}
            </title>
          </Helmet>
          <Container>
            <h1>
              {t(
                'areaSearch.application.preview.heading',
                'Area search application preview'
              )}
            </h1>

            <AreaSearchTargetSummary />

            {loading ? (
              <BlockLoader />
            ) : (
              <div className="ApplicationPreviewPage__top-level-sections">
                {renderSectionPreviewsOrGoBack(loggedIn)}
                <Button
                  variant="secondary"
                  onClick={() => setPreviousStep()}
                  disabled={isSubmitting}
                  className="ApplicationPreviewPage__submission-button"
                >
                  {t('application.returnToForm', 'Edit application')}
                </Button>
                <Button
                  variant="primary"
                  onClick={submit}
                  isLoading={isSubmitting}
                  loadingText={t(
                    'application.submitInProcess',
                    'Submitting...'
                  )}
                  className="ApplicationPreviewPage__submission-button"
                >
                  {t('application.submit', 'Submit application')}
                </Button>
                {lastError && (
                  <Notification
                    size="small"
                    type="error"
                    label={t('application.error.label', 'Submission error')}
                  >
                    {t(
                      'application.error.generic',
                      'The application could not be submitted correctly. Please try again later.'
                    )}
                  </Notification>
                )}
                {lastClientError !== null && (
                  <Notification
                    size="small"
                    type="error"
                    label={t(
                      'application.error.preparation.label',
                      'Preparation error'
                    )}
                  >
                    {getClientErrorMessage(lastClientError)}
                  </Notification>
                )}
              </div>
            )}
          </Container>
        </MainContentElement>
      )}
    </AuthDependentContent>
  );
};

export default connect(
  (state: RootState): State => ({
    formValues: getFormValues(AREA_SEARCH_FORM_NAME)(
      state
    ) as AreaSearchFormRoot,
    fieldTypeMapping: getFieldTypeMapping(state),
    lastSubmission: state.areaSearch.lastSubmission,
    submittedAnswerId: state.areaSearch.lastApplicationSubmissionId,
    lastError: state.areaSearch.lastApplicationError,
  }),
  {
    submitApplication: submitAreaSearchApplication,
  }
)(AreaSearchApplicationPreview);
