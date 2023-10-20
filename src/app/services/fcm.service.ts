import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import {
    ActionPerformed,
    PushNotificationSchema,
    PushNotifications,
    Token,
} from '@capacitor/push-notifications';

@Injectable()

export class FcmService {

    //-------------------------------------------------------------------------------------------------------------------
    constructor(
    ) {
    }

    public registerDevice() {
        // Request permission to use push notifications
        // iOS will prompt user and return if they granted permission or not
        // Android will just grant without prompting
        PushNotifications.requestPermissions().then(result => {
            if (result.receive === 'granted') {
                // Register with Apple / Google to receive push via APNS/FCM
                PushNotifications.register();
            } else {
                // Show some error
            }
        });

        PushNotifications.addListener('registration', (token: Token) => {
            console.log('Push registration success, token: ' + token.value);
            console.log('token', token)
        });

        PushNotifications.addListener('registrationError', (error: any) => {
            console.log('Error on registration: ' + JSON.stringify(error));
        });

        PushNotifications.addListener(
            'pushNotificationReceived',
            (notification: PushNotificationSchema) => {
                console.log('Push received: ' + JSON.stringify(notification));
            },
        );

        PushNotifications.addListener(
            'pushNotificationActionPerformed',
            (notification: ActionPerformed) => {
                console.log('Push action performed: ' + JSON.stringify(notification));
            },
        );
    }
}
