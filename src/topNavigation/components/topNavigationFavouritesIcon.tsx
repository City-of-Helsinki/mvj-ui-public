import React from 'react';
import { IconStar } from 'hds-react';

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
      <IconStar aria-hidden={true} />
    </div>
  );
};

export default TopNavigationFavouritesIcon;
