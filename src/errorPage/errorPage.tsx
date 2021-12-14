import React from 'react';
import { useTranslation } from 'react-i18next';

const ErrorPage = (): JSX.Element => {
  const { t } = useTranslation();
  return (
    <div className={'container'}>
      {t('error.pageNotFound', '404 Page not found')}
    </div>
  );
};

export default ErrorPage;
