import React from 'react';
import { useTranslation } from 'react-i18next';
import { PlotSearchTarget } from '../plotSearch/types';

interface Props {
  target: PlotSearchTarget;
}

const InfoLinks = (props: Props): JSX.Element | null => {
  const { target } = props;

  const { i18n } = useTranslation();
  const currentLanguageInfoLinks = target.info_links.filter(
    (link) => link.language === i18n.language
  );

  if (currentLanguageInfoLinks.length > 0) {
    return (
      <>
        <ul className="InfoLinks">
          {currentLanguageInfoLinks.map((link) => (
            <li key={link.id}>
              <a href={link.url} target="_blank" rel="noreferrer">
                {link.description}
              </a>
            </li>
          ))}
        </ul>
      </>
    );
  }
  return null;
};

export default InfoLinks;
