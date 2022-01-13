import React, { useState } from 'react';
import { Button, Card, LoadingSpinner } from 'hds-react';
import { Row, Col } from 'react-grid-system';
import { PlotSearch, PlotSearchTarget } from '../../plotSearch/types';
import { IconCrossCircle, IconArrowDown, IconArrowUp } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { getInfo } from '../utils';
import { FavouriteCardDetails } from './favouriteCardDetails';
import FavouriteCardMap from './favouriteCardMap';

interface Props {
  target: PlotSearchTarget;
  remove: (id: number) => void;
  plotSearch: PlotSearch | null;
}

const FavouriteCard = (props: Props): JSX.Element => {
  const { target, remove, plotSearch } = props;
  const { t } = useTranslation();
  const [fullDescription, setFullDescription] = useState(false);
  if (!plotSearch) {
    return (
      <Col style={{ alignContent: 'center' }}>
        <LoadingSpinner />
      </Col>
    );
  }

  const infoCols = getInfo(target, plotSearch, t);

  return (
    <Card className="favouritesPage__targetCard" border key={target.id}>
      <Row>
        <Col md={3} xs={4}>
          {/* Left Column (map)*/}
          <FavouriteCardMap target={target} />
        </Col>
        <Col md={9} xs={8}>
          {/* Right Column (text and actionbuttons etc.. */}
          <Row className="favouritesPage__targetCard__headerRow">
            {/* Top row with title and delete action on top right */}
            <Col md={8} xs={7}>
              <h3>{target.lease_address.address}</h3>
            </Col>
            <Col md={4} xs={5}>
              <Button
                className="favouritesPage__targetCard__removeButton"
                onClick={() => remove(target.id)}
                variant="supplementary"
                iconLeft={<IconCrossCircle style={{ color: 'black' }} />}
              >
                {t('favouritesPage.targetCard.removeButton')}
              </Button>
            </Col>
          </Row>
          <Row style={{ lineHeight: 2.2 }}>
            {/* Middle row with info & descriptions */}
            {infoCols.map((info) => (
              <FavouriteCardDetails
                key={info.key}
                info={info}
                fullDesc={fullDescription}
              />
            ))}
          </Row>
          <Row style={{ marginTop: 10 }}>
            {/* Bottom row with "more info" -action */}
            <Col>
              <Button
                style={{ float: 'right' }}
                onClick={() => setFullDescription(!fullDescription)}
                variant="supplementary"
                iconLeft={
                  fullDescription ? (
                    <IconArrowUp style={{ color: 'black' }} />
                  ) : (
                    <IconArrowDown style={{ color: 'black' }} />
                  )
                }
              >
                {fullDescription
                  ? t(
                      'favouritesPage.targetCard.showFullDesc.hide',
                      'Hide additional details'
                    )
                  : t(
                      'favouritesPage.targetCard.showFullDesc.show',
                      'Show additional details'
                    )}
              </Button>
            </Col>
          </Row>
        </Col>
      </Row>
    </Card>
  );
};

export default FavouriteCard;
