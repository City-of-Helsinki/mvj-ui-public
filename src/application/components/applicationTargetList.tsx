import React from 'react';
import { useTranslation } from 'react-i18next';
import { Row, Col } from 'react-grid-system';
import { connect } from 'react-redux';

import ScreenReaderText from '../../a11y/ScreenReaderText';
import { RootState } from '../../root/rootReducer';
import { Favourite } from '../../favourites/types';
import { TargetPlanType } from '../../plotSearch/types';

interface State {
  favourite: Favourite;
}

interface Props {
  favourite: Favourite;
}

const ApplicationTargetList = ({ favourite }: Props): JSX.Element => {
  const { t } = useTranslation();

  return (
    <div className="ApplicationTargetList">
      <ScreenReaderText>
        <h2>
          {t('application.targets.screenReaderHeading', 'Selected plots:')}
        </h2>
      </ScreenReaderText>
      <Row
        component="ul"
        className="ApplicationTargetList__targets"
        gutterWidth={48}
      >
        {favourite.targets.map((target) => (
          <Col
            component="li"
            xs={12}
            sm={12}
            md={6}
            lg={4}
            xl={4}
            key={target.plot_search_target.id}
          >
            <div className="ApplicationTargetList__target-address">
              {target.plot_search_target.target_plan.address}
              {target.plot_search_target.district &&
                `, ${target.plot_search_target.district.name}`}
            </div>
            <div className="ApplicationTargetList__target-identifier">
              <span className="ApplicationTargetList__target-identifier-text">
                {t('application.targets.identifier', 'Plot')}{' '}
              </span>
              {target.plot_search_target.target_plan_type ===
              TargetPlanType.PlanUnit
                ? target.plot_search_target.lease_identifier
                : target.plot_search_target.target_plan.identifier}
            </div>
          </Col>
        ))}
      </Row>
    </div>
  );
};

export default connect(
  (state: RootState): State => ({
    favourite: state.favourite.favourite,
  })
)(ApplicationTargetList);
