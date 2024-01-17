import { useRef, useState } from 'react';
import { Button, Dialog, IconQuestionCircle } from 'hds-react';
import { useTranslation } from 'react-i18next';

interface Props {
  showOnlyContent?: boolean;
}

const ApplicationProcedureInfo = ({
  showOnlyContent = false,
}: Props): JSX.Element => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const openModal = () => setIsOpen(true);
  const closeModal = () => setIsOpen(false);

  const dialogTargetRef = useRef(null);
  const openInfoDialogButtonRef = useRef(null);

  const dialogTitle = t(
    'application.procedure.popup.title',
    'How the application review process works',
  );

  const DialogContent = () => (
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
  );

  return (
    <>
      {!showOnlyContent ? (
        <div className="ApplicationProcedureInfo">
          <div id="dialog-target-ref" ref={dialogTargetRef} />
          <Button
            onClick={openModal}
            variant="supplementary"
            iconLeft={<IconQuestionCircle />}
            ref={openInfoDialogButtonRef}
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
            focusAfterCloseRef={openInfoDialogButtonRef}
            targetElement={dialogTargetRef.current}
          >
            <Dialog.Header
              id="ApplicationProcedureInfoPopup_Header"
              title={dialogTitle}
            />
            <Dialog.Content>
              <DialogContent />
            </Dialog.Content>
          </Dialog>
        </div>
      ) : (
        <div className="ApplicationProcedureInfo__content-only">
          <h2>{dialogTitle}</h2>
          <div className="ApplicationProcedureInfo__popup">
            <DialogContent />
          </div>
        </div>
      )}
    </>
  );
};

export default ApplicationProcedureInfo;
