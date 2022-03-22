import React from 'react';
import { useTranslation } from 'react-i18next';
import MainContentElement from '../a11y/MainContentElement';

const ErrorPage = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <MainContentElement className="ErrorPage">
      {t('error.pageNotFound', '404 Page not found')}
    </MainContentElement>
  );
};

export default ErrorPage;
