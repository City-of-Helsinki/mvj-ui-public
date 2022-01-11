import { LoadingSpinner } from 'hds-react';
import React from 'react';
import { useTranslation } from 'react-i18next';

const BlockLoader = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="BlockLoader">
      <LoadingSpinner
        className="BlockLoader__inner"
        loadingText={t('loader.loading', 'Please wait, content is loading...')}
      />
    </div>
  );
};

export default BlockLoader;
