import React, { useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { Container } from 'react-grid-system';
import { connect } from 'react-redux';

import { clearFavourite } from '../favourites/actions';

interface Props {
  clearFavourite: () => void;
}

const ApplicationSuccessPage = ({ clearFavourite }: Props) => {
  const { t } = useTranslation();

  useEffect(() => {
    clearFavourite();
  }, []);

  return (
    <Container>
      <h1>
        {t('application.success.heading', 'Thank you for your application')}
      </h1>
      <p>
        {t('application.success.body', 'Your application has been received.')}
      </p>
    </Container>
  );
};

export default connect(null, { clearFavourite })(ApplicationSuccessPage);
