import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import { getFormValues } from 'redux-form';
import { Button, Notification } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { Navigate, useNavigate } from 'react-router-dom';
import { Container } from 'react-grid-system';
import { Helmet } from 'react-helmet';

import { RootState } from '../root/rootReducer';
import {
  getClientErrorMessage,
  prepareApplicationForSubmission,
} from './helpers';
import { submitApplication } from './actions';
import {
  ApplicationFormRoot,
  ApplicationPreparationError,
  ApplicationSectionKeys,
  ApplicationSubmission,
  APPLICATION_FORM_NAME,
  FieldTypeMapping,
  UploadedFileMeta,
} from './types';
import { AppRoutes, getRouteById } from '../root/routes';
import { getPlotSearchFromFavourites } from '../favourites/helpers';
import { Favourite } from '../favourites/types';
import { PlotSearch } from '../plotSearch/types';
import AuthDependentContent from '../auth/components/authDependentContent';
import BlockLoader from '../loader/blockLoader';
import ApplicationTargetList from './components/applicationTargetList';
import ApplicationPreviewSubsection from './components/applicationPreviewSubsection';
import { getFieldTypeMapping } from './selectors';
import MainContentElement from '../a11y/MainContentElement';
import { getPageTitle } from '../root/helpers';

interface State {
  favourite: Favourite;
  relevantPlotSearch: PlotSearch | null;
  isFetchingFormAttributes: boolean;
  isFetchingPlotSearches: boolean;
  isSubmitting: boolean;
  submittedAnswerId: number;
  formValues: ApplicationFormRoot;
  fieldTypeMapping: FieldTypeMapping;
  pendingUploads: Array<UploadedFileMeta>;
  lastError: unknown;
}

interface Props {
  favourite: Favourite;
  relevantPlotSearch: PlotSearch | null;
  isFetchingFormAttributes: boolean;
  isFetchingPlotSearches: boolean;
  isSubmitting: boolean;
  submitApplication: (data: ApplicationSubmission) => void;
  submittedAnswerId: number;
  formValues: ApplicationFormRoot;
  fieldTypeMapping: FieldTypeMapping;
  pendingUploads: Array<UploadedFileMeta>;
  lastError: unknown;
}

const ApplicationPreviewPage = ({
  isSubmitting,
  submitApplication,
  submittedAnswerId,
  formValues,
  relevantPlotSearch,
  pendingUploads,
  lastError,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const navigate = useNavigate();

  const [lastClientError, setLastClientError] =
    useState<ApplicationPreparationError | null>(null);

  const [previousAnswerId] = useState<number>(submittedAnswerId);

  useEffect(() => {
    if (submittedAnswerId !== previousAnswerId) {
      navigate(getRouteById(AppRoutes.APPLICATION_SUBMIT));
    }
  }, [submittedAnswerId]);

  const submit = () => {
    try {
      setLastClientError(null);
      submitApplication(prepareApplicationForSubmission(APPLICATION_FORM_NAME));
    } catch (e) {
      setLastClientError(e as ApplicationPreparationError);
    }
  };

  return (
    <AuthDependentContent>
      {(loading, loggedIn) => (
        <MainContentElement className="ApplicationPreviewPage">
          <Helmet>
            <title>
              {getPageTitle(
                t('application.preview.pageTitle', 'Plot application')
              )}
            </title>
          </Helmet>
          <Container>
            <h1>
              {t('application.preview.heading', 'Plot application preview')}
            </h1>
            <ApplicationTargetList />
            {loading ? (
              <BlockLoader />
            ) : (
              <div className="ApplicationPreviewPage__top-level-sections">
                {/* these should already be loaded if we came from the first page; this page shouldn't be navigated to directly */}
                {loggedIn && relevantPlotSearch && pendingUploads ? (
                  relevantPlotSearch.form.sections.map((section) => (
                    <ApplicationPreviewSubsection
                      key={section.identifier}
                      section={section}
                      answers={
                        formValues[ApplicationSectionKeys.Subsections][
                          section.identifier
                        ]
                      }
                      headerTag={'h2'}
                      pendingUploads={pendingUploads}
                    />
                  ))
                ) : (
                  <Navigate
                    replace
                    to={getRouteById(AppRoutes.APPLICATION_FORM)}
                  />
                )}
                <Button
                  variant="secondary"
                  onClick={() =>
                    navigate(getRouteById(AppRoutes.APPLICATION_FORM))
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
    formValues: getFormValues('application')(state) as ApplicationFormRoot,
    isSubmitting: state.application.isSubmittingApplication,
    submittedAnswerId: state.application.submittedAnswer.id,
    favourite: state.favourite.favourite,
    relevantPlotSearch: getPlotSearchFromFavourites(state),
    isFetchingPlotSearches: state.plotSearch.isFetchingPlotSearches,
    isFetchingFormAttributes: state.application.isFetchingFormAttributes,
    fieldTypeMapping: getFieldTypeMapping(state),
    pendingUploads: state.application.pendingUploads,
    lastError: state.application.lastError,
  }),
  {
    submitApplication,
  }
)(ApplicationPreviewPage);
