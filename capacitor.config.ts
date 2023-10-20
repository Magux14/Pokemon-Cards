import { CapacitorConfig } from '@capacitor/cli';

const config: CapacitorConfig = {
    appId: 'io.ionic.starter',
    appName: 'capacitor-testapp',
    webDir: 'www',
    plugins: {
        SplashScreen: {
            launchAutoHide: true,
        },
        LocalNotifications: {
            smallIcon: 'ic_stat_icon_config_sample',
            iconColor: '#CE0B7C',
        },
        PushNotifications: {
            presentationOptions: ['alert', 'sound'],
        },
    },
};

export default config;