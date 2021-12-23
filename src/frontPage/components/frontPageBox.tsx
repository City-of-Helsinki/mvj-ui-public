import React from 'react';
import classNames from 'classnames';

interface Props {
  topLabel: string;
  label: string;
  bottomText: string;
  color: string;
}

const FrontPageBox = ({
  topLabel,
  label,
  bottomText,
  color,
}: Props): JSX.Element => {
  return (
    <div className={classNames('FrontPageBox', `FrontPageBox--${color}`)}>
      <div className="FrontPageBox__top-label">{topLabel}</div>
      <div className="FrontPageBox__image" />
      <div className="FrontPageBox__label">{label}</div>
      <div className="FrontPageBox__bottom-text">{bottomText}</div>
    </div>
  );
};

export default FrontPageBox;
