import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';
import * as Notifications from 'expo-notifications';
import { useEffect } from 'react';
import messaging, { FirebaseMessagingTypes } from '@react-native-firebase/messaging';
export default function App() {


  useEffect(() => {
      async function loadNotification() {
        Notifications.requestPermissionsAsync();
        const token= (await Notifications.getDevicePushTokenAsync()).data;
        console.log("Push token:",token);
       

        messaging().setBackgroundMessageHandler(async (remoteMessage) => {
          console.log("Message handled in the background!", remoteMessage);
          const notification = {
            title: remoteMessage.notification?.title,
            body: remoteMessage.notification?.body,
            data: remoteMessage.data, // optional data payload
          };
      
          // Schedule the notification with a null trigger to show immediately
          await Notifications.scheduleNotificationAsync({
            content: notification,
            trigger: null,
          });
        });
      
        // Handle push notifications when the app is in the foreground
        async function handlePushNotification(remoteMessage: FirebaseMessagingTypes.RemoteMessage) {

          console.log("Message handled in the foreground!", remoteMessage);
          console.log(remoteMessage);
          const notification = {
            title: remoteMessage.notification?.title,
            body: remoteMessage.notification?.body,
            data: remoteMessage.data, // optional data payload
          };
      
          // Schedule the notification with a null trigger to show immediately
          await Notifications.scheduleNotificationAsync({
            content: notification,
            trigger: null,
          });
        };
        messaging().onMessage(handlePushNotification);
      }
      loadNotification();
  });

  Notifications.setNotificationHandler({
    handleNotification: async () => ({
      shouldShowAlert: true,
      shouldPlaySound: true,
      shouldSetBadge: true,
    }),
  });
  
  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <StatusBar style="auto" />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
