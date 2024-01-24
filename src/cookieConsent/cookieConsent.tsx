import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { CookieModal } from 'hds-react';
import type { ContentSource } from 'hds-react';
import { isSupportedLanguage } from '../i18n';
import { SupportedLanguage } from '../i18n';

export const CookieConsent = (): JSX.Element => {
  const { t, i18n } = useTranslation();
  const [language, setLanguage] = useState<string>(i18n.language);

  const onLanguageChange = (newLang: string) => {
    if (isSupportedLanguage(newLang)) setLanguage(newLang);
  };
  const contentSource: ContentSource = {
    siteName: t(
      'mainAppTitle',
      'City of Helsinki plot and land leasing system',
      { lng: language },
    ),
    currentLanguage: language as SupportedLanguage,
    optionalCookies: {
      cookies: [
        {
          commonGroup: 'statistics',
          commonCookie: 'matomo', // Matomo is not currently in use, collect consent for future.
        },
      ],
    },
    language: {
      onLanguageChange,
    },
    focusTargetSelector: '#root',
    onAllConsentsGiven: (consents) => {
      if (!consents.matomo) {
        // TODO: Add Matomo opt-out in case it is introduced.
      }
    },
  };

  return <CookieModal contentSource={contentSource} />;
};
