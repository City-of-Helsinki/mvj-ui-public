import React from 'react';
import classNames from 'classnames';
import { IconHeartFill } from 'hds-react';

interface Props {
  symbol: string;
  colorIndex: number;
  isFavourite?: boolean;
  isHover?: boolean;
}

const MapSymbol = ({
  symbol,
  colorIndex,
  isFavourite,
  isHover,
}: Props): JSX.Element => {
  return (
    <>
      {isFavourite && <IconHeartFill className="MapSymbol__favourite-icon" />}
      <span
        className={classNames('MapSymbol', `MapSymbol--style-${colorIndex}`, {
          'MapSymbol--hover': isHover,
        })}
      >
        {symbol}
      </span>
    </>
  );
};

export default MapSymbol;
