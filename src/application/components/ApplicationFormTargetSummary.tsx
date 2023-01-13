import React from 'react';
import { Col, Row } from 'react-grid-system';
import { useTranslation } from 'react-i18next';

import { FavouriteTarget } from '../../favourites/types';
import FavouriteCardMap from '../../favouritesPage/components/favouriteCardMap';
import { FavouriteCardDetails } from '../../favouritesPage/components/favouriteCardDetails';
import { getInfo } from '../../favouritesPage/utils';
import { connect } from 'react-redux';
import { RootState } from '../../root/rootReducer';
import { ApiAttributes } from '../../api/types';

interface State {
  plotSearchAttributes: ApiAttributes;
}

interface Props {
  plotSearchAttributes: ApiAttributes;
  target?: FavouriteTarget | null;
}

const ApplicationFormTargetSummary = ({
  target,
  plotSearchAttributes,
}: Props): JSX.Element => {
  const { t } = useTranslation();

  if (!target) {
    return <div />;
  }

  const infoCols = getInfo(
    plotSearchAttributes,
    target.plot_search_target,
    null,
    t
  );

  return (
    <div className="ApplicationFormTargetSummary">
      <Row>
        <Col md={3} xs={4} className="ApplicationFormTargetSummary__map-column">
          <FavouriteCardMap target={target.plot_search_target} noLink />
        </Col>
        <Col md={9} xs={8}>
          <h3>
            {target.plot_search_target.target_plan.address}
            {target.plot_search_target.district &&
              `, ${target.plot_search_target.district}`}
          </h3>
          <div className="ApplicationFormTargetSummary__info">
            {infoCols.map((info) => (
              <FavouriteCardDetails
                key={info.key}
                info={info}
                fullDesc={false}
              />
            ))}
          </div>
        </Col>
      </Row>
    </div>
  );
};

export default connect(
  (state: RootState): State => ({
    plotSearchAttributes: state.plotSearch.plotSearchAttributes,
  })
)(ApplicationFormTargetSummary);
