import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { timeout } from 'rxjs/operators';
import { isPlatform } from '@ionic/angular';
import { HTTP, HTTPResponse } from '@awesome-cordova-plugins/http/ngx';
import { DownloadResponseAdvanceHttp, GenericWebResponseConverter, GenericWebResponseModel, HttpNativeOptions, SendRequestOptionsModel } from '../shared-models/generic-web-response.model';
import { environment } from 'src/environments/environment';
import { SHOW_WEBSERVICE_RESPONSES } from '../constants';
import { FirebaseWebResponseLogModel } from '../shared-models/firebase.model';

@Injectable()
// Clase genérica para peticiones web REST.
export class WebRestService extends GenericWebResponseConverter {

    private headers = {
        Accept: 'application/json',
        'Content-Type': 'application/json',
        responseType: 'json'
    };

    // -----------------------------------------------------------------------------------------------------------------
    constructor(
        private http: HttpClient,
        private httpNative: HTTP
    ) {
        super();
        if (!environment.production) {
            this.httpNative.setServerTrustMode('nocheck');
        }
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    // Hace una petición get genérica.
    public getAsync(url: string, headers: { [str: string]: string } = this.headers, options?: HttpNativeOptions): Promise<GenericWebResponseModel> {
        url = encodeURI(url);
        if (isPlatform('capacitor')) {
            return this.getAsyncCapacitor(url, headers, options);
        } else {
            return this.getAsyncWeb(url, headers, options);
        }
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    private getAsyncCapacitor(url: string, headers: { [str: string]: string } = this.headers, options?: HttpNativeOptions): Promise<GenericWebResponseModel> {
        return new Promise(resolve => {
            this.httpNative.setDataSerializer('json');
            const timeoutSeconds = options?.timeout ? options.timeout : this.timeoutSeconds;
            this.httpNative.setRequestTimeout(timeoutSeconds);
            this.httpNative.get(url, {}, headers).then(resp => {
                const genericWebResponse: GenericWebResponseModel = this.getGenericWebResponse(this.tryJsonParse(resp.data), resp.status);
                this.showWebLog(url, 'GET', null, genericWebResponse, '#BADBB9', false, headers);
                return resolve(genericWebResponse);
            }).catch(err => {
                const genericWebResponse: GenericWebResponseModel = this.getGenericErrorNativeWebResponse(this.tryJsonParse(err));
                this.showWebLog(url, 'GET', null, genericWebResponse, '#FF9A9A', true, headers);
                return resolve(genericWebResponse);
            });
        });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    private getAsyncWeb(url: string, headers: { [str: string]: string } = this.headers, options?: HttpNativeOptions): Promise<GenericWebResponseModel> {
        const optionsHeaders = { headers };
        const timeoutSeconds = options?.timeout ? options.timeout : this.timeoutSeconds;
        return new Promise(resolve => {
            const subs = this.http.get(url, optionsHeaders).pipe(timeout(timeoutSeconds * 1000)).subscribe(data => {
                const genericWebResponse: GenericWebResponseModel = this.getGenericWebResponse(data);
                this.showWebLog(url, 'GET', null, genericWebResponse, '#BADBB9', false, headers);
                subs.unsubscribe();
                return resolve(genericWebResponse);
            }, (err: HttpErrorResponse) => {
                const genericWebResponse: GenericWebResponseModel = this.getGenericErrorWebResponse(err);
                this.showWebLog(url, 'GET', null, genericWebResponse, '#FF9A9A', true, headers);
                subs.unsubscribe();
                return resolve(genericWebResponse);
            });
        });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    // Hace una petición post genérica.
    public postAsync(url: string, obj: any, headers: { [str: string]: string } = this.headers, options?: HttpNativeOptions): Promise<GenericWebResponseModel> {
        url = encodeURI(url);
        if (isPlatform('capacitor')) {
            return this.postAsyncCapacitor(url, obj, headers, options);
        } else {
            return this.postAsyncWeb(url, obj, headers, options);
        }
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    private postAsyncCapacitor(url: string, obj: any, headers: { [str: string]: string } = this.headers, options?: HttpNativeOptions):
        Promise<GenericWebResponseModel> {
        return new Promise(resolve => {
            this.httpNative.setDataSerializer('json');
            const timeoutSeconds = options?.timeout ? options.timeout : this.timeoutSeconds;
            this.httpNative.setRequestTimeout(timeoutSeconds);
            this.httpNative.post(url, obj, headers).then((resp: HTTPResponse) => {
                const genericWebResponse: GenericWebResponseModel = this.getGenericWebResponse(this.tryJsonParse(resp.data), resp.status);
                this.showWebLog(url, 'POST', obj, genericWebResponse, '#5296C2', false, headers);
                return resolve(genericWebResponse);
            }).catch(err => {
                const genericWebResponseE: GenericWebResponseModel = this.getGenericErrorNativeWebResponse(this.tryJsonParse(err));
                this.showWebLog(url, 'POST', obj, genericWebResponseE, '#FF9A9A', true, headers);
                return resolve(genericWebResponseE);
            });
        });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    private postAsyncWeb(url: string, obj: any, headers: { [str: string]: string } = this.headers, options?: HttpNativeOptions): Promise<GenericWebResponseModel> {
        const optionsHeaders = { headers };
        const json = JSON.stringify(obj);
        const timeoutSeconds = options?.timeout ? options.timeout : this.timeoutSeconds;
        return new Promise(resolve => {
            const subs = this.http.post(url, json, optionsHeaders).pipe(timeout(timeoutSeconds * 1000)).subscribe(data => {
                const genericWebResponse: GenericWebResponseModel = this.getGenericWebResponse(data);
                this.showWebLog(url, 'POST', obj, genericWebResponse, '#5296C2', false, headers);
                subs.unsubscribe();
                return resolve(genericWebResponse);
            }, (err: HttpErrorResponse) => {
                const genericWebResponseE: GenericWebResponseModel = this.getGenericErrorWebResponse(err);
                this.showWebLog(url, 'POST', obj, genericWebResponseE, '#FF9A9A', true, headers);
                subs.unsubscribe();
                return resolve(genericWebResponseE);
            });
        });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    // Hace una petición put genérica.
    public putAsync(url: string, obj: any, headers: { [str: string]: string } = this.headers, options?: HttpNativeOptions): Promise<GenericWebResponseModel> {
        url = encodeURI(url);
        if (isPlatform('capacitor')) {
            return this.putAsyncCapacitor(url, obj, headers, options);
        } else {
            return this.putAsyncWeb(url, obj, headers, options);
        }
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    private putAsyncCapacitor(url: string, obj: any, headers: { [str: string]: string } = this.headers, options?: HttpNativeOptions):
        Promise<GenericWebResponseModel> {
        return new Promise(resolve => {
            this.httpNative.setDataSerializer('json');
            const timeoutSeconds = options?.timeout ? options.timeout : this.timeoutSeconds;
            this.httpNative.setRequestTimeout(timeoutSeconds);
            this.httpNative.put(url, obj, headers).then((resp: HTTPResponse) => {
                const genericWebResponse: GenericWebResponseModel = this.getGenericWebResponse(this.tryJsonParse(resp.data), resp.status);
                this.showWebLog(url, 'PUT', obj, genericWebResponse, '#A985D1', false, headers);
                return resolve(genericWebResponse);
            }).catch(err => {
                const genericWebResponseE: GenericWebResponseModel = this.getGenericErrorNativeWebResponse(this.tryJsonParse(err));
                this.showWebLog(url, 'PUT', obj, genericWebResponseE, '#FF9A9A', true, headers);
                return resolve(genericWebResponseE);
            });
        });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    private putAsyncWeb(url: string, obj: any, headers: { [str: string]: string } = this.headers, options?: HttpNativeOptions): Promise<GenericWebResponseModel> {
        const optionsHeaders = { headers };
        const json = JSON.stringify(obj);
        const timeoutSeconds = options?.timeout ? options.timeout : this.timeoutSeconds;
        return new Promise(resolve => {
            const subs = this.http.put(url, json, optionsHeaders).pipe(timeout(timeoutSeconds * 1000)).subscribe(data => {
                const genericWebResponse: GenericWebResponseModel = this.getGenericWebResponse(data);
                this.showWebLog(url, 'PUT', obj, genericWebResponse, '#A985D1', false, headers);
                subs.unsubscribe();
                return resolve(genericWebResponse);
            }, (err: HttpErrorResponse) => {
                const genericWebResponseE: GenericWebResponseModel = this.getGenericErrorWebResponse(err);
                this.showWebLog(url, 'PUT', obj, genericWebResponseE, '#FF9A9A', true, headers);
                subs.unsubscribe();
                return resolve(genericWebResponseE);
            });
        });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    // Hace una petición delete genérica.
    public deleteAsync(url: string, obj: any, headers: { [str: string]: string } = this.headers, options?: HttpNativeOptions): Promise<GenericWebResponseModel> {
        url = encodeURI(url);
        if (isPlatform('capacitor')) {
            return this.deleteAsyncCapacitor(url, obj, headers, options);
        } else {
            return this.deleteAsyncWeb(url, obj, headers, options);
        }
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    private deleteAsyncCapacitor(url: string, obj: any, headers: { [str: string]: string } = this.headers, options?: HttpNativeOptions):
        Promise<GenericWebResponseModel> {
        return new Promise(resolve => {
            this.httpNative.setDataSerializer('json');
            const timeoutSeconds = options?.timeout ? options.timeout : this.timeoutSeconds;
            this.httpNative.setRequestTimeout(timeoutSeconds);
            this.httpNative.delete(url, obj, headers).then((resp: HTTPResponse) => {
                const genericWebResponse: GenericWebResponseModel = this.getGenericWebResponse(this.tryJsonParse(resp.data), resp.status);
                this.showWebLog(url, 'DELETE', obj, genericWebResponse, '#A985D1', false, headers);
                return resolve(genericWebResponse);
            }).catch(err => {
                const genericWebResponseE: GenericWebResponseModel = this.getGenericErrorNativeWebResponse(this.tryJsonParse(err));
                this.showWebLog(url, 'DELETE', obj, genericWebResponseE, '#FF9A9A', true, headers);
                return resolve(genericWebResponseE);
            });
        });
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    private deleteAsyncWeb(url: string, obj: any, headers: { [str: string]: string } = this.headers, options?: HttpNativeOptions): Promise<GenericWebResponseModel> {
        const json = JSON.stringify(obj);
        const optionsHeaders = { headers, body: json };
        const timeoutSeconds = options?.timeout ? options.timeout : this.timeoutSeconds;
        return new Promise(resolve => {
            const subs = this.http.request('delete', url, optionsHeaders).pipe(timeout(timeoutSeconds * 1000)).subscribe(data => {
                const genericWebResponse: GenericWebResponseModel = this.getGenericWebResponse(data);
                this.showWebLog(url, 'DELETE', obj, genericWebResponse, '#A985D1', false, headers);
                subs.unsubscribe();
                return resolve(genericWebResponse);
            }, (err: HttpErrorResponse) => {
                const genericWebResponseE: GenericWebResponseModel = this.getGenericErrorWebResponse(err);
                this.showWebLog(url, 'DELETE', obj, genericWebResponseE, '#FF9A9A', true, headers);
                subs.unsubscribe();
                return resolve(genericWebResponseE);
            });
        });
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public sendRequestCapacitorAsync(url: string, options: SendRequestOptionsModel): Promise<GenericWebResponseModel> {
        url = encodeURI(url);
        return new Promise(resolve => {

            if (options.serializer == 'urlencoded') {
                this.httpNative.setDataSerializer('urlencoded');
            } else {
                this.httpNative.setDataSerializer('json');
            }

            const timeoutSeconds = options?.timeout ? options.timeout : this.timeoutSeconds;
            this.httpNative.setRequestTimeout(timeoutSeconds);
            this.httpNative.sendRequest(url, options).then((resp: HTTPResponse) => {
                const genericWebResponse: GenericWebResponseModel = this.getGenericWebResponse(this.tryJsonParse(resp.data), resp.status);
                this.showWebLog(url, 'sendRequest', options, genericWebResponse, '#33FFE6', false, options.headers);
                return resolve(genericWebResponse);
            }).catch(err => {
                const genericWebResponse: GenericWebResponseModel = this.getGenericErrorNativeWebResponse(this.tryJsonParse(err));
                this.showWebLog(url, 'sendRequest', options, genericWebResponse, '#FF9A9A', true, options.headers);
                return resolve(genericWebResponse);
            });
        });
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public async downloadFileAsync(url: string, obj: any, headers: { [str: string]: string } = this.headers, downloadPath: string, options?: HttpNativeOptions): Promise<GenericWebResponseModel> {
        const timeoutSeconds = options?.timeout ? options.timeout : this.timeoutSeconds;
        this.httpNative.setRequestTimeout(timeoutSeconds);
        let error: any;
        const downloadResponse: DownloadResponseAdvanceHttp | null = await this.httpNative.downloadFile(url, obj, headers, downloadPath).catch(err => {
            error = err;
            return null;
        });
        let genericWebResponseModel: GenericWebResponseModel;
        if (downloadResponse) {
            genericWebResponseModel = {
                data: downloadResponse,
                httpStatus: 200,
                message: null,
                success: true
            }
            this.showWebLog(url, 'download', downloadPath, genericWebResponseModel, '#E26DA6', false, headers);
        } else {
            genericWebResponseModel = {
                data: null,
                httpStatus: error.status,
                message: error,
                error: error.error,
                success: false
            }
            this.showWebLog(url, 'download', downloadPath, genericWebResponseModel, '#FF9A9A', true, headers);
        }
        return genericWebResponseModel;
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    public showWebLog(url: string, method: string, sentData: any, receivedData: GenericWebResponseModel, color: string, error: boolean = false, headers: { [str: string]: string }) {
        if (SHOW_WEBSERVICE_RESPONSES) {
            console.log('%cINICIO - - - \nrespuesta servicio ' + method + ': ' + url, 'background-color: ' + color);
            console.log('%cheaders: ', 'background-color: ' + color);
            console.log(headers);
            if (sentData !== null) {
                console.log('%cobjeto enviado: ', 'background-color: ' + color);
                console.log(sentData);
                if (sentData.serializer == 'multipart' && sentData.data) {
                    for (const value of sentData.data.entries()) {
                        console.log(value);
                    }
                }
            }
            console.log('%crespuesta recibida: ', 'background-color: ' + color);
            console.log(receivedData);

            const show = localStorage.getItem('raw-web');
            if (show) {
                const strError: string = this.getStringWebError(url, method, sentData, receivedData, headers);
                console.log(strError);
            }

            console.log('%cFIN - - - ', 'background-color: ' + color);
        }
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    private getStringWebError(url: string, method: string, sentData: any, receivedData: any, headers: { [str: string]: string }): string {
        const webError: FirebaseWebResponseLogModel = {
            endpoint: url,
            jsonRequest: JSON.stringify(sentData),
            jsonResponse: JSON.stringify(receivedData),
            method: method,
            type: "REST",
            headers
        }

        let str: string = '--------------------------------------------------------------------';

        str += '\n\nMethod: ' + webError.method;

        str += '\n\nEndpoint: \n' + webError.endpoint;

        str += '\n\nHeaders:';
        str += '\n' + JSON.stringify(webError.headers, null, 10);

        str += '\n\nJSON Request:';
        str += '\n' + JSON.stringify(JSON.parse(webError.jsonRequest), null, 10);

        str += '\n\nJSON Response:';
        str += '\n' + JSON.stringify(JSON.parse(webError.jsonResponse), null, 10);
        str += '\n\n' + '--------------------------------------------------------------------';

        return str;
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    public fromObjectToGETString(obj: any) {
        let link = '?';
        Object.keys(obj).forEach(key => link = link + key + '=' + obj[key] + '&');
        return link.slice(0, -1);
    }

}
