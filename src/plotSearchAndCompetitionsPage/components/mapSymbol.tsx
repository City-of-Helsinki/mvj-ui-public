import React from 'react';
import classNames from 'classnames';

interface Props {
  symbol: string;
  colorIndex: number;
}

const MapSymbol = ({ symbol, colorIndex }: Props): JSX.Element => {
  return (
    <span className={classNames('MapSymbol', `MapSymbol--style-${colorIndex}`)}>
      {symbol}
    </span>
  );
};

export default MapSymbol;
