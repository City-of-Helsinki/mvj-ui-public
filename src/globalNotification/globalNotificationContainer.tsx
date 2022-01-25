import React, { useContext } from 'react';
import { GlobalNotificationCtx } from './globalNotificationProvider';

const GlobalNotificationContainer = (): JSX.Element | null => {
  const { render } = useContext(GlobalNotificationCtx);
  return <div className="GlobalNotificationContainer">{render()}</div>;
};

export default GlobalNotificationContainer;
