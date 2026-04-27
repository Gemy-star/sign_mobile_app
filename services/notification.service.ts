// services/notification.service.ts
// Handles push notification permissions and scheduling

import { isRunningInExpoGo } from 'expo';
import { Platform } from 'react-native';

// In Expo Go SDK 53+, DevicePushTokenAutoRegistration.fx.js runs as a module-level side
// effect inside expo-notifications and throws a hard error. Use the same detection function
// that expo-notifications itself uses (isRunningInExpoGo) to guard the require.

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let N: any = null;
if (!isRunningInExpoGo()) {
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  N = require('expo-notifications');
  N.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: false,
      priority: N.AndroidNotificationPriority.HIGH,
    }),
  });
}

export const setupAndroidChannel = async (): Promise<void> => {
  if (Platform.OS !== 'android' || !N) return;
  await N.setNotificationChannelAsync('daily-reminder', {
    name: 'Daily Reminder',
    importance: N.AndroidImportance.HIGH,
    sound: 'default',
    vibrationPattern: [0, 250, 250, 250],
  });
};

export const requestNotificationPermissions = async (): Promise<boolean> => {
  if (Platform.OS === 'web' || !N) return false;
  const { status: existing } = await N.getPermissionsAsync();
  if (existing === 'granted') return true;
  const { status } = await N.requestPermissionsAsync({
    ios: {
      allowAlert: true,
      allowBadge: true,
      allowSound: true,
      allowCriticalAlerts: false,
      provideAppNotificationSettings: false,
    },
  });
  return status === 'granted';
};

export const scheduleDailyNotification = async (
  hour: number,
  minute: number,
  title: string,
  body: string,
): Promise<void> => {
  if (!N) return;
  await N.cancelAllScheduledNotificationsAsync();
  await N.scheduleNotificationAsync({
    content: {
      title,
      body,
      sound: true,
      ...(Platform.OS === 'android' && { channelId: 'daily-reminder' }),
    },
    trigger: {
      type: N.SchedulableTriggerInputTypes.DAILY,
      hour,
      minute,
    },
  });
};

export const cancelAllNotifications = async (): Promise<void> => {
  if (!N) return;
  await N.cancelAllScheduledNotificationsAsync();
};

/**
 * Register a listener that fires when the user taps a notification.
 * Returns a cleanup function — call it inside useEffect's return.
 *
 * @param onTap  Called with the notification identifier when user taps.
 */
export const setupNotificationResponseHandler = (
  onTap: (identifier: string) => void,
): (() => void) => {
  if (!N) return () => {};
  const subscription = N.addNotificationResponseReceivedListener(
    (response: { notification: { request: { identifier: string } } }) => {
      onTap(response.notification.request.identifier);
    },
  );
  return () => subscription.remove();
};
