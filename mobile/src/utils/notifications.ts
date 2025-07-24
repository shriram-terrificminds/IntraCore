import OneSignal from 'react-native-onesignal';

export function initOneSignal() {
  // IMPORTANT: This will only work in a custom dev client (EAS build), not Expo Go
  OneSignal.setAppId('YOUR-ONESIGNAL-APP-ID'); // <-- Replace with your real OneSignal App ID
  OneSignal.setNotificationOpenedHandler(response => {
    console.log('OneSignal notification opened:', response);
    // You can add navigation or other logic here
  });
}

export async function registerPlayerId() {
  const deviceState = await OneSignal.getDeviceState();
  const playerId = deviceState?.userId;
  // send playerId to backend on login if needed
  console.log('OneSignal playerId:', playerId);
}
