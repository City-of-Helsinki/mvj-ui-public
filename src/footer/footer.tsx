import React from 'react';
import { Footer } from 'hds-react';

const FooterComponent = (): JSX.Element => {
  return (
    <Footer
      title={'Footer lorem ipsum'}
      theme={{
        '--footer-background': 'var(--color-gold)',
        '--footer-color': 'var(--color-white)',
        '--footer-divider-color': 'var(--color-white)',
        '--footer-focus-outline-color': 'var(--color-white)',
      }}
    >
      <Footer.Base
        copyrightHolder="Copyright"
        copyrightText="All rights reserved"
      />
    </Footer>
  );
};

export default FooterComponent;
