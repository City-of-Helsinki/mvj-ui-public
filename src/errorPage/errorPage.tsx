import { useTranslation } from 'react-i18next';
import { Helmet } from 'react-helmet';

import MainContentElement from '../a11y/MainContentElement';
import { getPageTitle } from '../root/helpers';

const ErrorPage = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <MainContentElement className="ErrorPage">
      <Helmet>
        <title>
          {getPageTitle(t('errorPage.notFound.pageTitle', 'Page not found'))}
        </title>
      </Helmet>
      {t('errorPage.notFound.explanation', '404 Page not found')}
    </MainContentElement>
  );
};

export default ErrorPage;
