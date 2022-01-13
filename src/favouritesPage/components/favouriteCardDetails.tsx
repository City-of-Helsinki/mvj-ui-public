import React from 'react';
import { Info } from '../utils';
import { Col } from 'react-grid-system';

interface Props {
  info: Info;
  fullDesc: boolean;
}

export const FavouriteCardDetails = (props: Props): JSX.Element => {
  const { info, fullDesc } = props;

  if (fullDesc) {
    return (
      <>
        <Col xs={6} component="dt">
          <span style={{ fontWeight: 'bold' }}>{info.key}</span>
        </Col>
        <Col xs={6} component="dd">
          {info.value}
        </Col>
      </>
    );
  }

  if (fullDesc == info.fullDescOnly) {
    return (
      <>
        <Col>
          <span style={{ fontWeight: 'bold' }}>{info.key}</span>
          <br />
          {info.value}
        </Col>
      </>
    );
  }
  return <></>;
};
