import React from 'react';
import { useGlobalNotifications } from './globalNotificationProvider';

const GlobalNotificationContainer = (): JSX.Element | null => {
  const { render } = useGlobalNotifications();
  return <div className="GlobalNotificationContainer">{render()}</div>;
};

export default GlobalNotificationContainer;
