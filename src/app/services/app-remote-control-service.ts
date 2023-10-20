import { Injectable } from '@angular/core';
import { errorObserver$ } from 'src/app/app.component';
import { environment } from 'src/environments/environment';
import { ALERT_LOG_ERROR } from '../constants';
import { NETWORK } from '../namespaces/network.namespace';
import { FirebaseService } from './firebase.service';
import { UtilitiesService } from './utilities.service';

export interface ConfigAppVersionControl {
    ultimaVersion: string;
    mostrarAlertaNuevaVersion: boolean;
    mostrarErrores: boolean;
}
@Injectable({
    providedIn: 'root'
})
export class AppRemoteControlService {

    //-------------------------------------------------------------------------------------------------------------------
    constructor(
        private firebaseService: FirebaseService,
        private utilitiesService: UtilitiesService,
    ) {
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    private async getConfig(): Promise<ConfigAppVersionControl> {
        if (!NETWORK.hasInternet()) {
            return null;
        }

        let coleccion: string = 'configuracion'
        if (environment.production) {
            coleccion += '_prod';
        }

        const resp: {
            data: any,
            httpStatus: number,
            success: boolean,
            message: string
        } = await this.firebaseService.getCollectionDocuments(coleccion);

        if (!resp.success || !resp.data) {
            return null;
        }

        const lstColeccion = resp.data || [];
        if (lstColeccion.length == 0) {
            return null;
        }

        const config: ConfigAppVersionControl = resp.data[0];
        return config
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async listenerErrores() {
        const config: ConfigAppVersionControl = await this.getConfig();
        let lstStackErrors: any[] = [];
        let disponibleParaMostrar: boolean = true;
        if (ALERT_LOG_ERROR || (config && config.mostrarErrores)) {
            errorObserver$.subscribe(async error => {
                if (error) {
                    if (disponibleParaMostrar) {
                        disponibleParaMostrar = false;
                        const alert = await this.utilitiesService.alertLogError('Runtime Error', error);
                        alert.onDidDismiss().then(() => {
                            showStackErrors();
                        });
                    } else {
                        lstStackErrors.push(error);
                    }
                }
            });
        }

        const showStackErrors = async () => {
            for (let error of lstStackErrors) {
                const alert = await this.utilitiesService.alertLogError('Runtime Error', error);
                await alert.onDidDismiss();
            }
            lstStackErrors = [];
            disponibleParaMostrar = true;
        }
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async validarVersion() {
        const appInfo = await this.utilitiesService.getAppInfoAsync();
        let appVersion: string;
        if (appInfo) {
            appVersion = appInfo.version;
        }
        const config: ConfigAppVersionControl = await this.getConfig();
        if (appVersion && config && config.mostrarAlertaNuevaVersion && (config.ultimaVersion > appVersion)) {
            this.utilitiesService.alert('Nueva actualización',
                'Hay una nueva versión disponible para esta aplicación. <br><br> Actual: <strong>' + appVersion +
                '</strong><br>Nueva: <strong>' + config.ultimaVersion + '</strong>');
        }
    }
}
