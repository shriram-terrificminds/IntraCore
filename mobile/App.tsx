// App.tsx
import React, { useEffect } from 'react';
import OneSignal from 'react-native-onesignal';
import { NavigationContainer } from '@react-navigation/native';
import { AuthProvider } from './src/contexts/AuthContext';
import Navigation from './src/navigation';
import { navigationRef } from './src/navigationRef';

const ONESIGNAL_APP_ID = '8f98d172-c3be-458b-b393-77fe637539ed';

const App: React.FC = () => {
  useEffect(() => {
    // 1) App ID & logging
    OneSignal.setAppId(ONESIGNAL_APP_ID);
    OneSignal.setLogLevel(6, 0);
    OneSignal.promptForPushNotificationsWithUserResponse();

    // 2) Fired when a notification arrives in the foreground  
    OneSignal.setNotificationWillShowInForegroundHandler(event => {
      const notif = event.getNotification();
      const route = notif.additionalData?.route;
      if (route) {
        navigationRef.current?.navigate(route);
      }
      // must complete or the notification won't show
      event.complete(notif);
    });

    // 3) Fired when the user taps a notification  
    OneSignal.setNotificationOpenedHandler(opened => {
      const data = opened.notification.additionalData;
      const route = data?.route;
      const payload = data?.payload;
      if (route) {
        navigationRef.current?.navigate(route, payload ? { notificationPayload: payload } : undefined);
      }
    });

    // 4) Listen for subscription changes (to grab your Player ID)  
    OneSignal.addSubscriptionObserver(event => {
      if (event.to.isSubscribed && event.to.userId) {
        alert(`OneSignal Player ID: ${event.to.userId}`);
      }
    });
  }, []);

  return (
    <AuthProvider>
      <NavigationContainer ref={navigationRef}>
        <Navigation />
      </NavigationContainer>
    </AuthProvider>
  );
};

export default App;
