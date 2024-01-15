import { useState } from 'react';
import { Button, Dialog, IconQuestionCircle } from 'hds-react';
import { useTranslation } from 'react-i18next';

const ApplicationProcedureInfo = (): JSX.Element => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  return (
    <div className="ApplicationProcedureInfo">
      <Button
        onClick={openModal}
        variant="supplementary"
        iconLeft={<IconQuestionCircle />}
      >
        {t(
          'application.procedure.link',
          'Information about the application review process',
        )}
      </Button>
      <Dialog
        id="ApplicationProcedureInfoPopup"
        className="ApplicationProcedureInfo__popup"
        aria-labelledby="ApplicationProcedureInfoPopup_Header"
        isOpen={isOpen}
        close={closeModal}
        closeButtonLabelText={t(
          'application.procedure.popup.closeButton',
          'Close',
        )}
      >
        <Dialog.Header
          id="ApplicationProcedureInfoPopup_Header"
          title={t(
            'application.procedure.popup.title',
            'How the application review process works',
          )}
        />
        <Dialog.Content>
          <ol className="ApplicationProcedureInfo__popup-steps">
            <li>
              {t(
                'application.procedure.popup.stages.submission',
                'The applicant submits their application.',
              )}
            </li>
            <li>
              {t(
                'application.procedure.popup.stages.forwarding',
                'The application is forwarded to the correct city department for processing.',
              )}
            </li>
            <li>
              {t(
                'application.procedure.popup.stages.review',
                'The city confirms if the area is eligible to be leased for the applied-for use case and requests further information from the applicant if necessary. Other parties relevant to the decision might be consulted at this stage as well.',
              )}
            </li>
            <li>
              {t(
                'application.procedure.popup.stages.offer',
                'If the city decides to lease the area to the applicant, a draft contract will be sent to them for commenting.',
              )}
            </li>
            <li>
              {t(
                'application.procedure.popup.stages.decision',
                'The city will make a formal lease decision and the lease contract will be signed.',
              )}
            </li>
          </ol>
        </Dialog.Content>
      </Dialog>
    </div>
  );
};

export default ApplicationProcedureInfo;
