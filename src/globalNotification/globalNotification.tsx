import React from 'react';
import {
  IconAlertCircleFill,
  IconCheckCircleFill,
  IconErrorFill,
  IconInfoCircleFill,
  Notification,
  NotificationType,
} from 'hds-react';
import { useTranslation } from 'react-i18next';
import { useGlobalNotifications } from './globalNotificationProvider';

export interface Props {
  id: string;
  label?: string;
  icon?: boolean;
  body: string;
  type: NotificationType;
}

const GlobalNotification = (props: Props): JSX.Element | null => {
  const { t } = useTranslation();
  const { popNotification } = useGlobalNotifications();

  const getIcon = (type: NotificationType): JSX.Element => {
    switch (type) {
      case 'alert':
        return (
          <IconAlertCircleFill className="GlobalNotificationContainer__notification-icon--alert" />
        );
      case 'info':
        return (
          <IconInfoCircleFill className="GlobalNotificationContainer__notification-icon--info" />
        );
      case 'success':
        return (
          <IconCheckCircleFill className="GlobalNotificationContainer__notification-icon--success" />
        );
      case 'error':
        return (
          <IconErrorFill className="GlobalNotificationContainer__notification-icon--error" />
        );
    }
  };

  return (
    <Notification
      key={props.id}
      label={props.label || null}
      position="top-right"
      className={`GlobalNotificationContainer__notification`}
      autoClose
      closeButtonLabelText={t(
        'globalNotifications.notification.close',
        'close'
      )}
      onClose={() => popNotification()}
      type={props.type}
    >
      <div className="GlobalNotificationContainer__notification-body">
        {props.icon && (
          <div className="GlobalNotificationContainer__notification-icon-container">
            {getIcon(props.type)}
          </div>
        )}
        <div className="GlobalNotificationContainer__notification-text-container">
          {props.body}
        </div>
      </div>
    </Notification>
  );
};

export default GlobalNotification;
