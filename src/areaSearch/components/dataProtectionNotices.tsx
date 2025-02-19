import { Link } from 'hds-react';
import { Col, Row } from 'react-grid-system';
import { useTranslation } from 'react-i18next';

const DataProtectionNotices = (): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="DataProtectionNotices">
      <h3>
        {t('areaSearch.dataProtectionNotices.title', 'Tietosuojaselosteet')}
      </h3>
      <Row className="DataProtectionNotices__link-row">
        <Col>
          <Link
            href={t(
              'areaSearch.dataProtectionNotices.tontit.externalUrl',
              'https://www.hel.fi/static/liitteet-2019/Kaupunginkanslia/Rekisteriselosteet/Kymp/Tonttien%20hankinnan%20ja%20luovutuksen%20asiakasrekisteri.pdf',
            )}
            external
            openInNewTab
            size="M"
            aria-label={t(
              'areaSearch.dataProtectionNotices.tontit.ariaLabel',
              'Data protection notice for Tonttien hankinnan ja luovutuksen asiakasrekisteri.',
            )}
            openInExternalDomainAriaLabel={t(
              'application.ariaLabels.openInExternalDomain',
            )}
            openInNewTabAriaLabel={t('application.ariaLabels.openInNewTab')}
          >
            {t(
              'areaSearch.dataProtectionNotices.tontit.linkText',
              'Helsingin kaupungin tonttien hankinnan ja luovutuksen asiakasrekisteri',
            )}
          </Link>
        </Col>
      </Row>
      <Row className="DataProtectionNotices__link-row">
        <Col>
          <Link
            href={t(
              'areaSearch.dataProtectionNotices.alueet.externalUrl',
              'https://www.hel.fi/static/liitteet-2019/Kaupunginkanslia/Rekisteriselosteet/Kymp/Alueiden%20käytön%20lupa-%20ja%20vuokrausasioiden%20asiakasrekisteri.pdf',
            )}
            external
            openInNewTab
            size="M"
            aria-label={t(
              'areaSearch.dataProtectionNotices.alueet.ariaLabel',
              'Data protection notice for Alueiden käytön lupa- ja vuokrausasioiden asiakasrekisteri.',
            )}
            openInExternalDomainAriaLabel={t(
              'application.ariaLabels.openInExternalDomain',
            )}
            openInNewTabAriaLabel={t('application.ariaLabels.openInNewTab')}
          >
            {t(
              'areaSearch.dataProtectionNotices.alueet.linkText',
              'Alueiden käytön lupa- ja vuokrausasioiden asiakasrekisteri',
            )}
          </Link>
        </Col>
      </Row>
      <Row className="DataProtectionNotices__link-row">
        <Col>
          <Link
            href={t(
              'areaSearch.dataProtectionNotices.liikuntapalvelut.externalUrl',
              'https://www.hel.fi/static/liitteet-2019/Kaupunginkanslia/Rekisteriselosteet/Kuva/Liikuntapalvelujen%20vuokrauksenhallintarekisteri.pdf',
            )}
            external
            openInNewTab
            size="M"
            aria-label={t(
              'areaSearch.dataProtectionNotices.liikuntapalvelut.ariaLabel',
              'Data protection notice for Liikuntapalvelujen vuokrauksenhallintarekisteri',
            )}
            openInExternalDomainAriaLabel={t(
              'application.ariaLabels.openInExternalDomain',
            )}
            openInNewTabAriaLabel={t('application.ariaLabels.openInNewTab')}
          >
            {t(
              'areaSearch.dataProtectionNotices.liikuntapalvelut.linkText',
              'Liikuntapalvelujen vuokrauksenhallintarekisteri',
            )}
          </Link>
        </Col>
      </Row>
    </div>
  );
};

export default DataProtectionNotices;
