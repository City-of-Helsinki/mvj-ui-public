import React, { useState } from 'react';
import GlobalNotification, {
  Props as NotificationProps,
} from './globalNotification';

interface GlobalNotificationContextInterface {
  notifications: NotificationProps[];
  render: () => JSX.Element[] | null;
  pushNotification: (notificationProps: NotificationProps) => void;
  popNotification: (id?: string) => void;
}

interface GlobalNotificationProviderInterface {
  children: JSX.Element;
}

const defaultContext: GlobalNotificationContextInterface = {
  notifications: [],
  render: () => null,
  pushNotification: (notificationProps) => notificationProps,
  popNotification: () => null,
};

export const GlobalNotificationCtx =
  React.createContext<GlobalNotificationContextInterface>(defaultContext);

const GlobalNotificationProvider = (
  props: GlobalNotificationProviderInterface
): JSX.Element => {
  const [notifications, setNotifications] = useState<NotificationProps[]>([]);

  const render = () =>
    notifications.map((n) => (
      <GlobalNotification
        key={n.id}
        id={n.id}
        body={n.body}
        type={n.type}
        icon={n.icon}
      />
    ));

  const pushNotification = (notification: NotificationProps): void => {
    if (notifications.some((n) => n.id === notification.id)) {
      popNotification(notification.id);
    }
    setNotifications((oldNotifications) => [...oldNotifications, notification]);
  };

  const popNotification = (id?: string): void => {
    if (id) {
      setNotifications((oldNotifications) => {
        const newNotifications = [...oldNotifications];
        const index = newNotifications.findIndex((n) => n.id === id);
        newNotifications.splice(index, 1);
        return newNotifications;
      });
    }
    setNotifications((oldNotifications) => {
      const newNotifications = [...oldNotifications];
      newNotifications.pop();
      return newNotifications;
    });
  };

  const context: GlobalNotificationContextInterface = {
    notifications: notifications,
    render: render,
    pushNotification: pushNotification,
    popNotification: popNotification,
  };

  return (
    <GlobalNotificationCtx.Provider value={context}>
      {props.children}
    </GlobalNotificationCtx.Provider>
  );
};

export default GlobalNotificationProvider;
