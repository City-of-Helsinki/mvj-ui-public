import React, { Fragment } from 'react';
import { SearchInput } from 'hds-react';
import SidePanel from '../../panel/sidePanel';

const MapSearchComponent = (): JSX.Element => {
  return (
    <SidePanel>
      <Fragment>
        <SearchInput
          label=""
          helperText=""
          searchButtonAriaLabel="Search"
          clearButtonAriaLabel="Clear search field"
          onSubmit={(submittedValue) =>
            console.log('Submitted value:', submittedValue)
          }
          style={{ padding: '15px', backgroundColor: '#48505B' }}
        />
        <div>{'NÄYTÄ TYYPPI(Vapaana)'}</div>
        <div>{'Kaikki(42)'}</div>
        <div>{'Pientalotonttihaku'}</div>
        <div>{'Vapaa haku'}</div>
      </Fragment>
    </SidePanel>
  );
};

export default MapSearchComponent;
