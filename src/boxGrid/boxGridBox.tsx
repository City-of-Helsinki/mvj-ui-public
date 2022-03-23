import React, { ReactNode } from 'react';
import classNames from 'classnames';

interface Props {
  topLabel?: string;
  label: string;
  bottomText: string;
  color?: 'pink' | 'gray' | 'yellow' | 'blue';
  image?: ReactNode;
  actions?: ReactNode;
}

const BoxGridBox = ({
  topLabel,
  label,
  bottomText,
  color = 'gray',
  image,
  actions,
}: Props): JSX.Element => {
  return (
    <div className={classNames('BoxGridBox', `BoxGridBox--${color}`)}>
      {topLabel && <div className="BoxGridBox__top-label">{topLabel}</div>}
      {image && <div className="BoxGridBox__image">{image}</div>}
      <div className="BoxGridBox__label">{label}</div>
      <div className="BoxGridBox__bottom-text">{bottomText}</div>
      {actions && <div className="BoxGridBox__actions">{actions}</div>}
    </div>
  );
};

export default BoxGridBox;
