import React from 'react';
import GlobalNotification from './globalNotification';
import { Notification } from './types';
import { connect } from 'react-redux';
import { RootState } from '../root/rootReducer';

interface State {
  notifications: Notification[];
}

interface Props {
  notifications: Notification[];
}

const GlobalNotificationContainer = ({
  notifications,
}: Props): JSX.Element | null => {
  return (
    <div className="GlobalNotificationContainer">
      {notifications.map((n) => (
        <GlobalNotification key={n.id} {...n} />
      ))}
    </div>
  );
};

export default connect(
  (state: RootState): State => ({
    notifications: state.notifications.notifications,
  }),
  []
)(GlobalNotificationContainer);
