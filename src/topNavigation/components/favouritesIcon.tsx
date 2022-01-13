import React from 'react';
import { IconHeart } from 'hds-react';

interface Props {
  count: number;
}

const FavouritesIcon = (props: Props): JSX.Element => {
  return (
    <div className="TopNavigation_FavouritesIcon">
      {props.count > 0 && (
        <div className="TopNavigation__FavouritesIcon__FavCount">
          {props.count}
        </div>
      )}
      <IconHeart aria-hidden={true} />
    </div>
  );
};

export default FavouritesIcon;
