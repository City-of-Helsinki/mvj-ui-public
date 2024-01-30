import { useTranslation } from 'react-i18next';
import { Container } from 'react-grid-system';
import { Helmet } from 'react-helmet';

import MainContentElement from '../a11y/MainContentElement';
import { getPageTitle } from '../root/helpers';
import ApplicationProcedureInfo from '../application/components/ApplicationProcedureInfo';
import ScrollToTop from '../common/ScrollToTop';
import { useEffect } from 'react';
import { AREA_SEARCH_FORM_NAME } from './types';
import { initialize } from 'redux-form';
import { RootState } from '../root/rootReducer';
import { connect } from 'react-redux';
import { initializeAreaSearchForm } from './helpers';

export interface Props {
  initializeForm: typeof initialize;
  applicationIdentifiers: string;
}

const AreaSearchApplicationSuccessPage = ({
  initializeForm,
  applicationIdentifiers,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  useEffect(() => {
    initializeForm(AREA_SEARCH_FORM_NAME, initializeAreaSearchForm());
  }, []);

  let successMessage = t(
    'application.success.body',
    'Your application has been received.',
  );
  if (applicationIdentifiers) {
    successMessage = t(
      'application.success.body_one',
      'Your application has been received.',
      { applicationIdentifiers },
    );
  }

  return (
    <>
      <ScrollToTop />
      <MainContentElement className="ApplicationSuccessPage">
        <Helmet>
          <title>
            {getPageTitle(
              t('application.success.pageTitle', 'Application sent'),
            )}
          </title>
        </Helmet>
        <Container>
          <h1>
            {t('application.success.heading', 'Thank you for your application')}
          </h1>
          <p>{successMessage}</p>
          <ApplicationProcedureInfo showOnlyContent={true} />
        </Container>
      </MainContentElement>
    </>
  );
};

export default connect((state: RootState) => state, {
  initializeForm: initialize,
})(AreaSearchApplicationSuccessPage);
