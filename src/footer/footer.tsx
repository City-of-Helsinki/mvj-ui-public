import { Footer, Logo, logoFiDark } from 'hds-react';
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
      <Footer.Utilities>
        <Footer.Link
          label={t(
            'footer.customerService.label',
            'Kaupunkiympäristön asiakaspalvelu',
          )}
          href={t(
            'footer.customerService.url',
            'https://www.hel.fi/fi/kaupunkiymparisto-ja-liikenne/kaupunkiympariston-asiakaspalvelu',
          )}
        />
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
            'footer.dataProtection.url',
            'https://www.hel.fi/fi/paatoksenteko-ja-hallinto/tietoa-helsingista/tietosuoja-ja-tiedonhallinta/tietosuoja',
          )}
        />
        <Footer.Link
          label={t('footer.registerStatement.label', 'Rekisteriseloste')}
          href={t(
            'footer.registerStatement.url',
            'https://www.hel.fi/static/liitteet-2019/Kaupunginkanslia/Rekisteriselosteet/Kymp/Tonttien%20hankinnan%20ja%20luovutuksen%20asiakasrekisteri.pdf',
          )}
        />
      </Footer.Base>
    </Footer>
  );
};

export default FooterComponent;
