import { useTranslation } from 'react-i18next';
import { Container } from 'react-grid-system';
import { Helmet } from 'react-helmet';

import MainContentElement from '../a11y/MainContentElement';
import { getPageTitle } from '../root/helpers';

const AreaSearchApplicationSuccessPage = (): JSX.Element => {
  const { t } = useTranslation();

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
          {t('application.success.body', 'Your application has been received.')}
        </p>
      </Container>
    </MainContentElement>
  );
};

export default AreaSearchApplicationSuccessPage;
