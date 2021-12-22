import React from 'react';
import { Footer } from 'hds-react';
import { useTranslation } from 'react-i18next';

const FooterComponent = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Footer
      title={'Footer lorem ipsum'}
      theme={{
        '--footer-background': 'var(--color-gold)',
        '--footer-color': 'var(--color-white)',
        '--footer-divider-color': 'var(--color-white)',
        '--footer-focus-outline-color': 'var(--color-white)',
      }}
      className="Footer"
    >
      <Footer.Base
        copyrightHolder={t('footer.copyright.holder', 'Copyright')}
        copyrightText={t('footer.copyright.text', 'All rights reserved')}
      />
    </Footer>
  );
};

export default FooterComponent;
