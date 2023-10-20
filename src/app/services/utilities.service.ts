import { Injectable } from "@angular/core";
import { Geolocation } from '@capacitor/geolocation';
import { AlertController, ToastController, LoadingController, ModalController, isPlatform, getPlatforms } from '@ionic/angular';
import { TranslateService } from '@ngx-translate/core';
import { EmbebedGenericPage } from "../pages/embebed-generic/embebed-generic.page";
import { Clipboard } from '@awesome-cordova-plugins/clipboard/ngx';
import { Device, DeviceId, DeviceInfo } from '@capacitor/device';
import { App, AppInfo} from '@capacitor/app';
import { environment } from 'src/environments/environment';
import { AlertOptionsModel, CleanTextOptionsModel, FromDateToISOStringLocalOptionsModel, ToastOptionsModel } from "../shared-models/utilities-options.model";
import { GeolocationModel } from "../shared-models/geolocation.model";
import { getPlatformId } from "@capacitor/core/types/util";


@Injectable()
export class UtilitiesService {

    //-------------------------------------------------------------------------------------------------------------------
    constructor(
        private alertCtrl: AlertController,
        private toastController: ToastController,
        private loadingController: LoadingController,
        private translateService: TranslateService,
        private modalController: ModalController,
        private clipboard: Clipboard,
    ) {
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public copyToClipBoard(text: string) {
        this.clipboard.copy(text).then(async () => {
            const message: string = await this.getTextFromi18nJsonLabelAsync('i18n_GENERAL.label_copied_to_clipboard');
            this.toast(message);
        }).catch(err => {
            console.error(err);
        });
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async getGeolcation(): Promise<GeolocationModel> {
        let coordinates: any = await Geolocation.getCurrentPosition().catch(err => {
            console.log(err);
            return null;
        });
        if (coordinates == null) {
            // Por si falla lo intenta de nuevo en 2 segundos.
            await new Promise<any>((resolve) => {
                setTimeout(() => {
                    return resolve(true);
                }, 2_000);
            });
            coordinates = await Geolocation.getCurrentPosition().catch(err => {
                console.log(err);
                return null;
            });
        }
        if (coordinates == null) {
            return null;
        }
        return {
            lat: coordinates.coords.latitude,
            lng: coordinates.coords.longitude
        };
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Close all alerts and another modals.
    public closeAllOverlay() {
        for (let i = 0; i < 2; i++) {
            this.alertCtrl.dismiss().catch(err => { });
            this.modalController.dismiss().catch(err => { });
            this.alertCtrl.dismiss().catch(err => { });
        }
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async loadingAsync(message?: string): Promise<HTMLIonLoadingElement> {
        if (!message) {
            message = await this.getTextFromi18nJsonLabelAsync('i18n_GENERAL.label_loading');
        }

        return this.loadingController.create({
            cssClass: 'my-custom-class',
            message
        });
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async alert(title: string, message: string, options?: AlertOptionsModel): Promise<HTMLIonAlertElement> {
        const defaultOptions: AlertOptionsModel = {
            instantShow: true,
            callback: null
        }

        const mergedOptions: AlertOptionsModel = {
            ...defaultOptions,
            ...options
        }

        const alert: HTMLIonAlertElement = await this.alertCtrl.create({
            header: title,
            message,
            buttons: [{
                text: await this.getTextFromi18nJsonLabelAsync('i18n_GENERAL.label_close'),
                handler: mergedOptions.callback
            }],
            backdropDismiss: false,
        });
        if (mergedOptions.instantShow) {
            alert.present();
        }
        return alert;
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async alertGeneralError(options?: AlertOptionsModel): Promise<HTMLIonAlertElement> {
        const defaultOptions: AlertOptionsModel = {
            instantShow: true,
            callback: null
        }

        const mergedOptions: AlertOptionsModel = {
            ...defaultOptions,
            ...options
        }

        const alert: HTMLIonAlertElement = await this.alertCtrl.create({
            header: await this.getTextFromi18nJsonLabelAsync('i18n_ERROR.err_error'),
            message: await this.getTextFromi18nJsonLabelAsync('i18n_ERROR.err_general'),
            buttons: [{
                text: await this.getTextFromi18nJsonLabelAsync('i18n_GENERAL.label_close'),
                handler: mergedOptions.callback
            }],
            backdropDismiss: false,
        });
        if (mergedOptions.instantShow) {
            alert.present();
        }
        return alert;
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    public async alertLogError(title: string, message: string, options: AlertOptionsModel = {
        instantShow: true,
        callback: null
    }): Promise<HTMLIonAlertElement> {
        const alert: HTMLIonAlertElement = await this.alertCtrl.create({
            header: title,
            message,
            buttons: [{
                text: await this.getTextFromi18nJsonLabelAsync('i18n_GENERAL.label_close'),
                handler: options.callback
            }],
            backdropDismiss: true,
            cssClass: 'alert-error'
        });
        if (options.instantShow) {
            alert.present();
        }
        return alert;
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async presentAlertConfirmAsync(message: string): Promise<boolean> {
        return new Promise(async (resolve) => {
            const alert = await this.alertCtrl.create({
                cssClass: 'my-custom-class',
                message,
                buttons: [
                    {
                        text: await this.getTextFromi18nJsonLabelAsync('i18n_GENERAL.present_alert_cancel'),
                        role: 'cancel',
                        cssClass: 'secondary',
                        handler: () => {
                            return resolve(false);
                        }
                    }, {
                        text: await this.getTextFromi18nJsonLabelAsync('i18n_GENERAL.present_alert_accept'),
                        handler: () => {
                            return resolve(true)
                        }
                    }
                ]
            });
            alert.present();
        });
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public toast(message: string, options?: ToastOptionsModel) {
        const defaultOptions: ToastOptionsModel = {
            duration: 2000,
            position: 'middle', // 'top' | 'bottom' | 'middle'
            color: null // null | 'danger' | 'success'
        }

        const mergedOptions: ToastOptionsModel = {
            ...defaultOptions,
            ...options
        }
        this.toastController.create({
            message,
            cssClass: 'toast',
            duration: mergedOptions.duration,
            position: mergedOptions.position,
            color: mergedOptions.color
        }).then(toast => {
            toast.present();
        });
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async toastNoInternet() {
        this.toast(await this.getTextFromi18nJsonLabelAsync('i18n_ERROR.label_network_err'));
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public isJSON(json: string): boolean {
        try {
            JSON.parse(json);
            return true;
        } catch (e) {
            return false;
        }
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Clean text with the options marked
    public cleanText(text: string, options?: CleanTextOptionsModel): string {

        const defaultOptions: CleanTextOptionsModel = {
            trim: true,
            lowerCase: true,
            upperCase: false,
            cleanSpecialCharacters: true,
            english: false,
            cleanVocalsVariations: true
        }

        const mergedOptions: CleanTextOptionsModel = {
            ...defaultOptions,
            ...options
        }

        if (!text) {
            return text;
        }

        if (mergedOptions.trim) {
            text = text.trim();
        }

        if (mergedOptions.lowerCase) {
            text = text.toLowerCase();
        }

        if (mergedOptions.upperCase) {
            text = text.toUpperCase();
        }

        if (mergedOptions.cleanSpecialCharacters) {
            text = text.replace(/[`~!@#$%^&*()_|+\-=?;:'',.<>\{\}\[\]\\\/]/gi, '');
        }

        if (mergedOptions.english) {
            text = text.replace(new RegExp(/[áàâãäå]/g), 'a');
            text = text.replace(new RegExp(/[ÁÀÂÃÄÅ]/g), 'A');
            text = text.replace(new RegExp(/[éèêë]/g), 'e');
            text = text.replace(new RegExp(/[ÉÈÊË]/g), 'E');
            text = text.replace(new RegExp(/[íìîï]/g), 'i');
            text = text.replace(new RegExp(/[ÍÌÎÏ]/g), 'I');
            text = text.replace(new RegExp(/ñ/g), 'n');
            text = text.replace(new RegExp(/Ñ/g), 'N');
            text = text.replace(new RegExp(/[óòôõö]/g), 'o');
            text = text.replace(new RegExp(/[ÓÒÔÕÖ]/g), 'O');
            text = text.replace(new RegExp(/[úùûü]/g), 'u');
            text = text.replace(new RegExp(/[ÚÙÛÜ]/g), 'U');
        } else if (mergedOptions.cleanVocalsVariations) {
            text = text.replace(new RegExp(/[àâãäå]/g), 'a');
            text = text.replace(new RegExp(/[ÀÂÃÄÅ]/g), 'A');
            text = text.replace(new RegExp(/[èêë]/g), 'e');
            text = text.replace(new RegExp(/[ÈÊË]/g), 'E');
            text = text.replace(new RegExp(/[ìîï]/g), 'i');
            text = text.replace(new RegExp(/[ÌÎÏ]/g), 'I');
            text = text.replace(new RegExp(/[òôõö]/g), 'o');
            text = text.replace(new RegExp(/[ÒÔÕÖ]/g), 'O');
            text = text.replace(new RegExp(/[ùûü]/g), 'u');
            text = text.replace(new RegExp(/[ÙÛÜ]/g), 'U');
        }

        return text;
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public strTitleCase(str: string): string {
        const sentence = str.toLowerCase().split(' ');
        for (let i = 0; i < sentence.length; i++) {
            sentence[i] = sentence[i][0].toUpperCase() + sentence[i].slice(1);
        }
        return sentence.join(' ');
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public fromDateToISOStringLocal(date: Date, options?: FromDateToISOStringLocalOptionsModel): string {

        const defaultOptions: FromDateToISOStringLocalOptionsModel = {
            short: false
        }

        const mergedOptions: FromDateToISOStringLocalOptionsModel = {
            ...defaultOptions,
            ...options
        }

        function z(n) {
            return (n < 10 ? '0' : '') + n;
        }
        return (
            mergedOptions.short ? (
                date.getFullYear() +
                '-' +
                z(date.getMonth() + 1) +
                '-' +
                z(date.getDate())
            ) : (
                date.getFullYear() +
                '-' +
                z(date.getMonth() + 1) +
                '-' +
                z(date.getDate()) +
                ' ' +
                z(date.getHours()) +
                ':' +
                z(date.getMinutes()) +
                ':' +
                z(date.getSeconds())
            )
        );
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public addTimeToDate(date: Date, value: number, timeOption: 'minutes' | 'days' | 'hours' = 'minutes'): Date {

        const newDate: Date = new Date(date);
        if (timeOption == 'minutes') {
            newDate.setMinutes(newDate.getMinutes() + value);
        } else if (timeOption == 'hours') {
            newDate.setMinutes(newDate.getMinutes() + (value * 60));
        } else if (timeOption == 'days') {
            newDate.setDate(newDate.getDate() + value);
        }
        return newDate;
    }

    // //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // // Se utiliza espacialmente para IOS que hace las fechas como quiere >:( por el cambio de horario...
    // public fromStrDateToDate(strDate: string): Date {
    //     try {
    //         let fecha = new Date();
    //         fecha.setFullYear(parseInt(strDate.substring(0, 4)), parseInt(strDate.substring(5, 7)) - 1,
    //             parseInt(strDate.substring(8, 10)));
    //         fecha.setHours(parseInt(strDate.substring(11, 13)), parseInt(strDate.substring(14, 16)));
    //         return fecha;
    //     } catch (err) {
    //         return null
    //     }
    // }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async getDayNameAsync(date: Date): Promise<string> {
        switch (date.getDay()) {
            case 0: return this.getTextFromi18nJsonLabelAsync('i18n_WEEK.label_sunday');
            case 1: return this.getTextFromi18nJsonLabelAsync('i18n_WEEK.label_monday');
            case 2: return this.getTextFromi18nJsonLabelAsync('i18n_WEEK.label_tuesday');
            case 3: return this.getTextFromi18nJsonLabelAsync('i18n_WEEK.label_wednesday');
            case 4: return this.getTextFromi18nJsonLabelAsync('i18n_WEEK.label_thursday');
            case 5: return this.getTextFromi18nJsonLabelAsync('i18n_WEEK.label_friday');
            case 6: return this.getTextFromi18nJsonLabelAsync('i18n_WEEK.label_saturday');
            default: return '';
        }
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public getTextFromi18nJsonLabelAsync(i18nJsonLabel: string, values: Array<any> = []): Promise<string> {
        return new Promise<any>((resolve, reject) => {

            const params: any = {};
            for (let i = 0; i < values.length; i++) {
                params['value' + (i + 1)] = values[i];
            }

            let sucesss = false;
            this.translateService.get(i18nJsonLabel, params).subscribe(result => {
                sucesss = true;
                return resolve((result === i18nJsonLabel ? '-' : result));
            });

            setTimeout(() => {
                if (!sucesss) {
                    {
                        return resolve('');
                    }
                }
            }, 2_000);
        });
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async showModalEmbebebUrl(url: string) {
        const modal = await this.modalController.create({
            component: EmbebedGenericPage,
            cssClass: 'custom-modal',
            componentProps: {
                url
            }

        });
        return modal.present();
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async getDeviceUuidAsync(): Promise<string> {
        if (isPlatform('pwa') || isPlatform('mobileweb') || isPlatform('desktop')) {
            return 'web uuid';
        }
        const deviceId: DeviceId = await Device.getId();
        return deviceId.uuid;
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async getDevicInfoAsync(): Promise<DeviceInfo> {
        return Device.getInfo();
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async getAppInfoAsync(): Promise<AppInfo> {
        
        if (isPlatform('pwa') || isPlatform('mobileweb') || isPlatform('desktop')) {
            return {
                name: this.getPlatform(),
                id: null,
                build: null,
                version: 'web'
            }
        }
        return App.getInfo();
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    private getPlatform() {
        const lstPlatforms = getPlatforms();
        if (lstPlatforms.length) {
            return lstPlatforms[0];
        }
        return 'unkown';
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public toTitleCase(str: string) {
        return str.replace(
            /\w\S*/g,
            function (txt) {
                return txt.charAt(0).toUpperCase() + txt.substr(1).toLowerCase();
            }
        );
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    public colorConsoleLog(str: string, obj?: any, color: string = '#BC90FF') {
        if (!environment.production) {
            console.log('%c' + str, 'background-color: ' + color);
            if (obj != null) {
                console.log(obj);
            }
        }
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Hace una carrera de promesas, la que se resuelva primero es la que se regresa.
    public async promiseRaceSetTimeout<T>(promise: Promise<T>, timeoutMilisec: number, valueIfTimeout: any): Promise<any> {

        const timeoutPromise = new Promise(resolve => {
            setTimeout(() => {
                return resolve(valueIfTimeout);
            }, timeoutMilisec);
        });

        return Promise.race([promise, timeoutPromise]).catch((err) => {
            console.error(err);
            return null;
        });
    }
}
