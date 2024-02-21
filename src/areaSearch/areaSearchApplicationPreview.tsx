import { useEffect, useState } from 'react';
import { Container } from 'react-grid-system';
import { Helmet } from 'react-helmet';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { Notification, Button } from 'hds-react';
import MainContentElement from '../a11y/MainContentElement';
import {
  ApplicationPreparationError,
  ApplicationSectionKeys,
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
import { setAreaSearchStep, submitAreaSearchApplication } from './actions';
import ApplicationPreviewSubsection from '../application/components/applicationPreviewSubsection';
import { getClientErrorMessage } from '../application/helpers';
import { prepareAreaSearchApplicationForSubmission } from './helpers';
import ApplicationProcedureInfo from '../application/components/ApplicationProcedureInfo';
import ScrollToTop from '../common/ScrollToTop';
import { AreaSearchStepperPageIndex } from './helpers';

interface State {
  lastSubmission: AreaSearch | null;
  formValues: AreaSearchFormRoot;
  submittedAnswerId: number;
  lastError: unknown;
  isSubmitting?: boolean;
}
interface Props extends State {
  submitApplication: (data: AreaSearchApplicationSubmission) => void;
  isSubmitting?: boolean;
  setAreaSearchStep: typeof setAreaSearchStep;
}

const AreaSearchApplicationPreview = ({
  submitApplication,
  lastSubmission,
  formValues,
  lastError,
  isSubmitting,
  submittedAnswerId,
  setAreaSearchStep,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  const [lastClientError, setLastClientError] =
    useState<ApplicationPreparationError | null>(null);

  const [previousAnswerId] = useState<number>(submittedAnswerId);

  useEffect(() => {
    if (submittedAnswerId !== previousAnswerId) {
      setAreaSearchStep(AreaSearchStepperPageIndex.SUCCESS);
    }
  }, [submittedAnswerId]);

  const submit = () => {
    try {
      setLastClientError(null);
      submitApplication(
        prepareAreaSearchApplicationForSubmission(AREA_SEARCH_FORM_NAME),
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
      setAreaSearchStep(AreaSearchStepperPageIndex.APPLICATION);
    }
  };

  return (
    <>
      <ScrollToTop />
      <AuthDependentContent>
        {(loading, loggedIn) => (
          <MainContentElement className="ApplicationPreviewPage">
            <Helmet>
              <title>
                {getPageTitle(
                  t(
                    'areaSearch.application.preview.pageTitle',
                    'Area search application',
                  ),
                )}
              </title>
            </Helmet>
            <Container>
              <div className="title-container">
                <div className="procedure-info">
                  <ApplicationProcedureInfo />
                </div>
                <h1>
                  {t(
                    'areaSearch.application.preview.heading',
                    'Area search application preview',
                  )}
                </h1>
              </div>

              <AreaSearchTargetSummary />

              {loading ? (
                <BlockLoader />
              ) : (
                <div className="ApplicationPreviewPage__top-level-sections">
                  {renderSectionPreviewsOrGoBack(loggedIn)}
                  <p>
                    {t(
                      'areaSearch.application.preview.emailConfirmationNotice',
                      'You will receive a notice with a copy of the application by email.',
                    )}
                  </p>
                  <hr className="ApplicationPreviewSubsection__hr" />
                  <Button
                    variant="secondary"
                    onClick={() =>
                      setAreaSearchStep(AreaSearchStepperPageIndex.APPLICATION)
                    }
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
                      'Submitting...',
                    )}
                    className="ApplicationPreviewPage__submission-button"
                  >
                    {t('application.submit', 'Submit application')}
                  </Button>
                  {!!lastError && (
                    <Notification
                      size="small"
                      type="error"
                      label={t('application.error.label', 'Submission error')}
                    >
                      {t(
                        'application.error.generic',
                        'The application could not be submitted correctly. Please try again later.',
                      )}
                    </Notification>
                  )}
                  {lastClientError !== null && (
                    <Notification
                      size="small"
                      type="error"
                      label={t(
                        'application.error.preparation.label',
                        'Preparation error',
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
    </>
  );
};

export default connect(
  (state: RootState): State => ({
    formValues: getFormValues(AREA_SEARCH_FORM_NAME)(
      state,
    ) as AreaSearchFormRoot,
    lastSubmission: state.areaSearch.lastSubmission,
    submittedAnswerId: state.areaSearch.lastApplicationSubmissionId,
    lastError: state.areaSearch.lastApplicationError,
    isSubmitting: state.areaSearch.isSubmittingAreaSearchApplication,
  }),
  {
    setAreaSearchStep,
    submitApplication: submitAreaSearchApplication,
  },
)(AreaSearchApplicationPreview);
