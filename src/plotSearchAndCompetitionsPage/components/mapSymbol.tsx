import React from 'react';
import classNames from 'classnames';
import { IconHeartFill } from 'hds-react';

interface Props {
  symbol: string;
  colorIndex: number;
  isFavourite?: boolean;
}

const MapSymbol = ({ symbol, colorIndex, isFavourite }: Props): JSX.Element => {
  return (
    <>
      {isFavourite && <IconHeartFill className="MapSymbol__favourite-icon" />}
      <span
        className={classNames('MapSymbol', `MapSymbol--style-${colorIndex}`)}
      >
        {symbol}
      </span>
    </>
  );
};

export default MapSymbol;
