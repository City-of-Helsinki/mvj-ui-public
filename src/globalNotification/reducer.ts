import { createSlice } from '@reduxjs/toolkit';
import {
  Notification,
  POP_NOTIFICATION,
  PopNotificationAction,
  PUSH_NOTIFICATION,
  PushNotificationAction,
} from './types';

type CurrentDisplayState = {
  notifications: Notification[];
};

const initialState: CurrentDisplayState = {
  notifications: [],
};

const notificationsSlice = createSlice({
  name: 'notifications',
  initialState,
  reducers: {},
  extraReducers: {
    [PUSH_NOTIFICATION]: (state, { payload }: PushNotificationAction) => {
      const index = state.notifications.findIndex((n) => n.id === payload.id);
      if (index) {
        state.notifications.splice(index, 1);
      }
      state.notifications.push(payload);
    },
    [POP_NOTIFICATION]: (state, { payload }: PopNotificationAction) => {
      if (payload) {
        const index = state.notifications.findIndex((n) => n.id === payload);
        state.notifications.splice(index, 1);
        return;
      }
      state.notifications.pop();
    },
  },
});

export default notificationsSlice.reducer;
