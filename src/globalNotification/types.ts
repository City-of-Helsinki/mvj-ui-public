import { NotificationType } from 'hds-react';

export interface Notification {
  id: string;
  icon?: boolean;
  body: string;
  type: NotificationType;
}

export const PUSH_NOTIFICATION = 'globalNotification/PUSH_NOTIFICATION';
export const POP_NOTIFICATION = 'globalNotification/POP_NOTIFICATION';

export interface PushNotificationAction {
  type: typeof PUSH_NOTIFICATION;
  payload: Notification;
}

export interface PopNotificationAction {
  type: typeof POP_NOTIFICATION;
  payload?: string;
}
