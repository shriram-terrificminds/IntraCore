RequestApp

This README will guide you through setting up the RequestApp React Native CLI project, running it on Android, and testing OneSignal push notifications using cURL.

🚀 Prerequisites

Node.js (LTS)

Yarn or npm

Java JDK & Android SDK (with environment variables configured)

Android emulator (API 30+ with Google Play services) or a physical device

CocoaPods (for iOS, if you plan to test on iOS)

A OneSignal account with:

App ID (8f98d172-c3be-458b-b393-77fe637539ed)

REST API Key (from Dashboard ► Settings ► Keys & IDs)

🏗️ Project Setup

Clone the repository

git clone <your-repo-url>
cd RequestApp

Install dependencies

# npm\ n  
npm install

# or yarn
yarn install

iOS (optional)

cd ios && pod install && cd ..

📱 Running on Android

Start the Metro bundler

npx react-native start --reset-cache

Build & launch on emulator/device

npx react-native run-android

You should see the app open on your Android emulator or device. On first launch, accept any push-permission prompts.

🆔 Obtaining Your OneSignal Player ID

In order to target your specific device with a test push, you need its Player ID.

In the app’s useEffect, ensure you have:

OneSignal.getDeviceState().then(state => console.log('OneSignal DeviceState:', state));

Look in the Metro/Logcat console for lines like:

OneSignal DeviceState: { isSubscribed: true, userId: '11cc386d-a4d3-4431-b6bb-73a96c5e286f', … }

Copy the userId value (your Player ID).

📣 Sending a Test Notification via cURL

Replace the placeholders below with your REST API Key and the Player ID you obtained.

curl --include \
     --request POST \
     --header "Content-Type: application/json; charset=utf-8" \
     --header "Authorization: Basic os_v2_app_r6mnc4wdxzcyxm4to77gg5jz5vwmp3aubtfebyvramo25rjfakmrvw4aifikwxs3damz5ry7lltyg74cqp3mnjref5nrbm3cphyizxa" \
     --data-binary '{
       "app_id": "8f98d172-c3be-458b-b393-77fe637539ed",
       "include_player_ids": ["11cc386d-a4d3-4431-b6bb-73a96c5e286f"],
       "headings": { "en": "Test Notification" },
       "contents": { "en": "Hello from RequestApp via cURL!" }
     }' \
     https://onesignal.com/api/v1/notifications

YOUR_REST_API_KEY: Found in OneSignal Dashboard ► Settings ► Keys & IDs

include_player_ids: Array of your device’s Player ID(s)

After running this command, you should see your test notification appear on the Android emulator/device within seconds.

🛠 Troubleshooting

No subscribed users?

Verify your emulator/device has Google Play services.

Check android/app/src/main/AndroidManifest.xml for the correct <meta-data android:name="onesignal_app_id" .../> entry.

Run adb logcat *:S OneSignal:V ReactNative:V to view OneSignal registration logs.

``** crash**

Ensure your code uses the v5 API:

OneSignal.setNotificationWillShowInForegroundHandler(event => {
  const notif = event.getNotification();
  event.complete(notif);
});

Happy coding and happy pushing! 🎉