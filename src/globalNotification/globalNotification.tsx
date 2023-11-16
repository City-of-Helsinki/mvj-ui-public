import { FC, useEffect, useState } from 'react';
import {
  IconAlertCircleFill,
  IconCheckCircleFill,
  IconErrorFill,
  IconInfoCircleFill,
  Notification,
  NotificationType,
  IconProps,
} from 'hds-react';
import { useTranslation } from 'react-i18next';
import classNames from 'classnames';
import { connect } from 'react-redux';
import { popNotification } from './actions';

interface Props {
  id: string;
  label?: string;
  icon?: boolean;
  body: string;
  type: NotificationType;
  popNotification: () => void;
}

const GlobalNotification = (props: Props): JSX.Element | null => {
  const { t } = useTranslation();
  const scrollThreshold = 150;
  const [isFixed, setIsFixed] = useState<boolean>(
    window.scrollY > scrollThreshold,
  );

  let IconComponent: FC<IconProps>;

  switch (props.type) {
    case 'alert':
      IconComponent = IconAlertCircleFill;
      break;
    case 'info':
      IconComponent = IconInfoCircleFill;
      break;
    case 'success':
      IconComponent = IconCheckCircleFill;
      break;
    case 'error':
      IconComponent = IconErrorFill;
      break;
  }

  useEffect(() => {
    const handleScroll = () => {
      setIsFixed(window.scrollY > scrollThreshold);
    };

    window.addEventListener('scroll', handleScroll);

    // Cleanup event listener on component unmount
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return (
    <Notification
      key={props.id}
      label={props.label || null}
      position="top-right"
      className={`GlobalNotificationContainer__notification${
        isFixed ? '--fixed' : ''
      }`}
      autoClose
      closeButtonLabelText={t(
        'globalNotifications.notification.close',
        'Close',
      )}
      onClose={() => props.popNotification()}
      type={props.type}
    >
      <div className="GlobalNotificationContainer__notification-body">
        {props.icon && (
          <div className="GlobalNotificationContainer__notification-icon-container">
            <IconComponent
              className={classNames(
                'GlobalNotificationContainer__notification-icon',
                `GlobalNotificationContainer__notification-icon--${props.type}`,
              )}
            />
          </div>
        )}
        <div className="GlobalNotificationContainer__notification-text-container">
          {props.body}
        </div>
      </div>
    </Notification>
  );
};

export default connect(null, { popNotification })(GlobalNotification);
