import React from 'react';
import { IconHeart } from 'hds-react';

interface Props {
  count: number;
}

const TopNavigationFavouritesIcon = (props: Props): JSX.Element => {
  return (
    <div className="TopNavigationFavouritesIcon">
      {props.count > 0 && (
        <div className="TopNavigationFavouritesIcon__favourite-count">
          {props.count}
        </div>
      )}
      <IconHeart aria-hidden={true} />
    </div>
  );
};

export default TopNavigationFavouritesIcon;
