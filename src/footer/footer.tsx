import {
  Footer,
  Logo,
  logoFiDark,
  IconFacebook,
  IconX,
  IconInstagram,
  IconLinkedin,
} from 'hds-react';
import { useTranslation } from 'react-i18next';
import { naviLinks } from '../topNavigation/topNavigation';
import { getRouteById } from '../root/helpers';

const FooterComponent = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <Footer
      title={t('footer.text', 'Footer lorem ipsum')}
      theme="dark"
      className="Footer"
    >
      <Footer.Navigation>
        {naviLinks.map((link) => (
          <Footer.Link
            key={getRouteById(link.to)}
            href={getRouteById(link.to)}
            label={t(link.label, link.default || '')}
          />
        ))}
      </Footer.Navigation>
      <Footer.Utilities
        soMeLinks={[
          <Footer.Link
            href="https://www.facebook.com/kaupunkiymparisto"
            title={t(
              'footer.some.facebook',
              'Helsingin kaupungin Facebook-tili',
            )}
            icon={<IconFacebook />}
            key="facebook"
          />,
          <Footer.Link
            href="https://twitter.com/HelsinkiKymp"
            title={t('footer.some.twitter', 'Helsingin kaupungin Twitter-tili')}
            icon={<IconX />}
            key="twitter"
          />,
          <Footer.Link
            href="https://www.instagram.com/kaupunkiymparisto"
            title={t(
              'footer.some.instagram',
              'Helsingin kaupungin Instagram-tili',
            )}
            icon={<IconInstagram />}
            key="instragram"
          />,
          <Footer.Link
            href="https://www.linkedin.com/company/kaupunkiymparisto"
            title={t(
              'footer.some.linkedin',
              'Helsingin kaupungin LinkedIn-tili',
            )}
            icon={<IconLinkedin />}
            key="linkedin"
          />,
        ]}
      >
        {t('footer.customerService', 'Kaupunkiympäristön asiakaspalvelu')}
      </Footer.Utilities>
      <Footer.Base
        logo={
          <Logo
            src={logoFiDark}
            size="medium"
            alt={t('footer.logo.alt', 'Helsinki logo')}
          />
        }
        copyrightHolder={t('footer.copyright.holder', 'Copyright')}
        backToTopLabel={t('footer.moveToTop', 'Siirry ylös')}
      >
        <Footer.Link
          label={t(
            'footer.accessabilityStatement.label',
            'Saavutettavuusseloste',
          )}
          href={t(
            'footer.accessabilityStatement.url',
            'https://www.hel.fi/saavutettavuus',
          )}
        />
        <Footer.Link
          label={t('footer.dataProtection.label', 'Tietosuoja')}
          href={t(
            'footer.accessabilityStatement.url',
            'https://www.hel.fi/fi/paatoksenteko-ja-hallinto/tietoa-helsingista/tietosuoja-ja-tiedonhallinta/tietosuoja',
          )}
        />
        <Footer.Link
          label={t('footer.registerStatement.label', 'Rekisteriseloste')}
          href={t('footer.accessabilityStatement.url', '#')}
        />
      </Footer.Base>
    </Footer>
  );
};

export default FooterComponent;
