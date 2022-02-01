import React, { useState } from 'react';
import { Button, Card } from 'hds-react';
import { Row, Col } from 'react-grid-system';
import { IconCrossCircle, IconArrowDown, IconArrowUp } from 'hds-react';
import { useTranslation } from 'react-i18next';
import { PlotSearch, PlotSearchTarget } from '../../plotSearch/types';
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

  const infoCols = getInfo(target, plotSearch as PlotSearch, t);

  return (
    <Card className="FavouriteCard" border key={target.id}>
      <Row>
        <Col md={3} xs={4}>
          {/* Left Column (map)*/}
          <FavouriteCardMap target={target} />
        </Col>
        <Col md={9} xs={8}>
          {/* Right Column (text and actionbuttons etc.. */}
          <Row className="FavouriteCard__header-row">
            {/* Top row with title and delete action on top right */}
            <Col md={8} xs={7}>
              <h3>{target.lease_address.address}</h3>
            </Col>
            <Col md={4} xs={5}>
              <Button
                className="FavouriteCard__action-button"
                onClick={() => remove(target.id)}
                variant="supplementary"
                iconLeft={
                  <IconCrossCircle className="FavouriteCard__action-button-icon" />
                }
              >
                {t(
                  'favouritesPage.targetCard.removeButton',
                  'Remove from list'
                )}
              </Button>
            </Col>
          </Row>
          <Row className="FavouriteCard__info-row">
            {/* Middle row with info & descriptions */}
            {infoCols.map((info) => (
              <FavouriteCardDetails
                key={info.key}
                info={info}
                fullDesc={fullDescription}
              />
            ))}
          </Row>
          <Row>
            {/* Bottom row with "more info" -action */}
            <Col>
              <Button
                className="FavouriteCard__action-button"
                onClick={() => setFullDescription(!fullDescription)}
                variant="supplementary"
                iconLeft={
                  fullDescription ? (
                    <IconArrowUp className="FavouriteCard__action-button-icon" />
                  ) : (
                    <IconArrowDown className="FavouriteCard__action-button-icon" />
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
