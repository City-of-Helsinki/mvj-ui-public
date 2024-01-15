import { Button, IconArrowDown, IconArrowUp } from 'hds-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Info } from '../../favouritesPage/utils';

interface Props {
  infoCols: Array<Info>;
}

const AreaSearchTargetSummaryInfo = ({ infoCols }: Props): JSX.Element => {
  const { t } = useTranslation();
  const [isFullDesc, setIsFullDesc] = useState<boolean>(true);

  return (
    <div className="AreaSearchTargetSummaryInfo">
      {infoCols.map((info) => {
        if (!info.fullDescOnly) {
          return (
            <div key={info.key} className="AreaSearchTargetSummaryInfoRow">
              <span className="AreaSearchTargetSummaryInfoRow__text">
                {info.key}
              </span>
              <span className="AreaSearchTargetSummaryInfoRow__value">
                {info.value}
              </span>
            </div>
          );
        }

        if (isFullDesc && info.fullDescOnly) {
          return (
            <div
              key={info.key}
              className="AreaSearchTargetSummaryInfoRow__full-desc"
            >
              <span className="AreaSearchTargetSummaryInfoRow__text">
                {info.key}
              </span>
              <span className="AreaSearchTargetSummaryInfoRow__value">
                {info.value}
              </span>
            </div>
          );
        }
      })}

      <Button
        className="FavouriteCard__action-button"
        onClick={() => setIsFullDesc(!isFullDesc)}
        variant="supplementary"
        iconLeft={
          isFullDesc ? (
            <IconArrowUp className="AreaSearchTargetSummaryInfo__action-button-icon" />
          ) : (
            <IconArrowDown className="AreaSearchTargetSummaryInfo__action-button-icon" />
          )
        }
      >
        {isFullDesc
          ? t(
              'areaSearch.targetCard.showFullDesc.hide',
              'Hide additional details',
            )
          : t(
              'areaSearch.targetCard.showFullDesc.show',
              'Show additional details',
            )}
      </Button>
    </div>
  );
};

export default AreaSearchTargetSummaryInfo;
