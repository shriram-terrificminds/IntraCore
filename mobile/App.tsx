// App.tsx
import React, { useEffect } from 'react';
import OneSignal from 'react-native-onesignal';
import { NavigationContainer, NavigationContainerRef } from '@react-navigation/native';
import { AuthProvider, useAuth } from './src/contexts/AuthContext';
import Navigation from './src/navigation';
import { navigationRef } from './src/navigationRef';
import { Alert } from 'react-native';
import type { RootStackParamList } from './src/navigation/types';

const ONESIGNAL_APP_ID = '8f98d172-c3be-458b-b393-77fe637539ed';

// Custom wrapper to handle OneSignal setup after login
const AppWithOneSignal: React.FC = () => {
  const { token } = useAuth();

  useEffect(() => {
    if (!token) return;
    // 1) App ID & logging
    OneSignal.setAppId(ONESIGNAL_APP_ID);
    OneSignal.setLogLevel(6, 0);
    OneSignal.promptForPushNotificationsWithUserResponse();

    // 2) Fired when a notification arrives in the foreground  
    OneSignal.setNotificationWillShowInForegroundHandler(event => {
      const notif = event.getNotification();
      const data = notif.additionalData as { route?: string } | undefined;
      const route = data?.route;
      if (route) {
        navigationRef.current?.navigate(route as never);
      }
      // must complete or the notification won't show
      event.complete(notif);
    });

    // 3) Fired when the user taps a notification  
    OneSignal.setNotificationOpenedHandler(opened => {
      const data = opened.notification.additionalData as { route?: string; payload?: any } | undefined;
      const route = data?.route;
      const payload = data?.payload;
      if (route) {
        if (payload) {
          (navigationRef as React.RefObject<NavigationContainerRef<RootStackParamList>>).current?.navigate(route as keyof RootStackParamList, { notificationPayload: payload });
        } else {
          (navigationRef as React.RefObject<NavigationContainerRef<RootStackParamList>>).current?.navigate(route as keyof RootStackParamList);
        }
      }
    });

    // 4) Listen for subscription changes (to grab your Player ID)  
    OneSignal.addSubscriptionObserver(event => {
      if (event.to.isSubscribed && event.to.userId) {
        Alert.alert('OneSignal Player ID', event.to.userId);
      }
    });
  }, [token]);

  return (
    <NavigationContainer ref={navigationRef}>
      <Navigation />
    </NavigationContainer>
  );
};

const App: React.FC = () => {
  return (
    <AuthProvider>
      <AppWithOneSignal />
    </AuthProvider>
  );
};

export default App;
