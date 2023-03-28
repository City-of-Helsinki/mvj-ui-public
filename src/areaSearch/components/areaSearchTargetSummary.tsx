import React from 'react';
import { Col, Row } from 'react-grid-system';
import { useTranslation } from 'react-i18next';
import { connect } from 'react-redux';
import { Link } from 'hds-react';
import ScreenReaderText from '../../a11y/ScreenReaderText';
import { Info } from '../../favouritesPage/utils';
import { renderDate } from '../../i18n/utils';
import { getAreaString } from '../../map/utils';
import { RootState } from '../../root/rootReducer';
import { AreaSearch, AreaSearchAttachment } from '../types';
import AreaSearchTargetSummaryMap from './areaSearchTargetSummaryMap';
import AreaSearchTargetSummaryInfo from './areaSearchTargetSummaryInfo';
import { generateAttachmentLink } from '../helpers';

interface State {
  lastSubmission: AreaSearch | null;
  areaSearchAttachments: Array<AreaSearchAttachment>;
}

interface Props {
  lastSubmission: AreaSearch | null;
  areaSearchAttachments: Array<AreaSearchAttachment>;
}

const AreaSearchTargetSummary = ({
  lastSubmission,
  areaSearchAttachments,
}: Props): JSX.Element | null => {
  const { t } = useTranslation();

  if (!lastSubmission) {
    return null;
  }

  const infoCols: Info[] = [
    {
      key: t('areaSearch.application.target.area', 'Area (m²)'),
      value: lastSubmission?.geometry
        ? `${getAreaString(lastSubmission.geometry)}`
        : '???',
      fullDescOnly: false,
    },
    {
      key: t('areaSearch.application.target.leaseTime', 'Lease time'),
      value:
        lastSubmission?.start_date && lastSubmission?.end_date
          ? `${renderDate(
              new Date(lastSubmission?.start_date as string)
            )} - ${renderDate(new Date(lastSubmission?.end_date as string))}`
          : '???',
      fullDescOnly: false,
    },
    {
      key: t('areaSearch.application.target.intendedUsage', 'Intended use'),
      value: lastSubmission?.intended_use
        ? lastSubmission.description_intended_use
        : '???',
      fullDescOnly: true,
    },
    {
      key: t(
        'areaSearch.application.target.areaDescription',
        'Area description'
      ),
      value: lastSubmission?.description_area
        ? lastSubmission.description_area
        : '???',
      fullDescOnly: true,
    },
  ];

  if (areaSearchAttachments.length > 0) {
    infoCols.push({
      key: t('areaSearch.application.target.attachments', 'Attachments'),
      value: areaSearchAttachments.map((attachment) => (
        <p key={attachment.id}>
          <Link href={generateAttachmentLink(attachment)} external openInNewTab>
            {attachment.name}
          </Link>
        </p>
      )),
      fullDescOnly: true,
    });
  }

  return (
    <div className="AreaSearchTargetSummary">
      <ScreenReaderText>
        <h2>
          {t(
            'areaSearch.application.target.screenReaderHeading',
            'Selected area:'
          )}
        </h2>
      </ScreenReaderText>
      <Row>
        <Col lg={3} sm={2} xs={12}>
          <AreaSearchTargetSummaryMap target={lastSubmission} />
        </Col>
        <Col lg={9} sm={10} xs={12} className="AreaSearchTargetSummary__target">
          <div className="AreaSearchTargetSummary__target-address">
            {lastSubmission.address
              ? `${lastSubmission.address} , ${lastSubmission.district}`
              : t(
                  'areaSearch.application.target.addressNotFound',
                  'No address found for the selected area'
                )}
          </div>
          <AreaSearchTargetSummaryInfo infoCols={infoCols} />
        </Col>
      </Row>
    </div>
  );
};

export default connect(
  (state: RootState): State => ({
    lastSubmission: state.areaSearch.lastSubmission,
    areaSearchAttachments: state.areaSearch.areaSearchAttachments,
  })
)(AreaSearchTargetSummary);
