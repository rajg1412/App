import * as Device from 'expo-device';
import * as Notifications from 'expo-notifications';
import Constants from 'expo-constants';

export async function registerForPushNotificationsAsync() {
    // ⚠️ Remote push notifications are NOT supported in Expo Go (SDK 53+).
    // You must use a Development Build to test this.
    const isExpoGo = Constants.appOwnership === 'expo';
    if (isExpoGo) {
        console.warn('⚠️ Push notifications are NOT supported in Expo Go. Please use a Development Build.');
        return null;
    }

    if (!Device.isDevice) {
        console.log('Must use physical device for Push Notifications');
        return null;
    }

    const { status: existingStatus } = await Notifications.getPermissionsAsync();
    let finalStatus = existingStatus;

    if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
    }

    if (finalStatus !== 'granted') {
        console.log('Permission not granted for push notifications!');
        return null;
    }

    try {
        const deviceToken = (await Notifications.getDevicePushTokenAsync()).data;
        console.log('Native Device Token (FCM):', deviceToken);
        return deviceToken;
    } catch (e) {
        console.log('Error getting device token:', e);
        return null;
    }
}
