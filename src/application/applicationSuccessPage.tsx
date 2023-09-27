import { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from 'react-grid-system';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';

import { clearFavourite } from '../favourites/actions';
import MainContentElement from '../a11y/MainContentElement';
import { getPageTitle } from '../root/helpers';
import { ApplicationResponse } from './types';
import { RootState } from '../root/rootReducer';

interface State {
  application: ApplicationResponse;
}

interface Props {
  clearFavourite: () => void;
  application: ApplicationResponse;
}

const ApplicationSuccessPage = ({ clearFavourite, application }: Props) => {
  const { t } = useTranslation();

  useEffect(() => {
    clearFavourite();
  }, []);

  const getApplicationIdentifiers = (): { value: string; count: number } => {
    const applicationIdentifiers = application.target_statuses.map(
      (targetStatus) => targetStatus.application_identifier,
    );
    return {
      value: applicationIdentifiers.join(', '),
      count: applicationIdentifiers.length,
    };
  };

  const applicationIdentifiers = getApplicationIdentifiers();

  return (
    <MainContentElement className="ApplicationSuccessPage">
      <Helmet>
        <title>
          {getPageTitle(t('application.success.pageTitle', 'Application sent'))}
        </title>
      </Helmet>
      <Container>
        <h1>
          {t('application.success.heading', 'Thank you for your application')}
        </h1>
        <p>
          {t(
            'application.success.body',
            'Your application has been received.',
            {
              applicationIdentifiers: applicationIdentifiers.value,
              count: applicationIdentifiers.count,
            },
          )}
        </p>
      </Container>
    </MainContentElement>
  );
};

export default connect(
  (state: RootState): State => ({
    application: state.application.submittedAnswer,
  }),
  { clearFavourite },
)(ApplicationSuccessPage);
