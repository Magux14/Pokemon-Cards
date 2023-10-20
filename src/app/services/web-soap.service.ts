import { Injectable } from '@angular/core';
import { FIREBASE_LOG, SHOW_WEBSERVICE_RESPONSES } from '../constants';
import { GenericWebResponseModel, GenericWebResponseConverter } from '../shared-models/generic-web-response.model';
import { HTTP } from '@awesome-cordova-plugins/http/ngx';
import { isPlatform } from '@ionic/angular';
import { FirebaseService } from './firebase.service';
import { FirebaseWebResponseLogModel } from '../shared-models/firebase.model';
import { ERROR_HANDLER } from '../namespaces/error-handler.namespace';

@Injectable()

// Clase genérica para peticiones web SOAP.
export class WebSoapService extends GenericWebResponseConverter {

    /*
        Para fabricar los modelos de manera rápida hacer un JSON.Stringify(temp1),
        entrar a la página: http://www.unit-conversion.info/texttools/replace-text/
        Cambiar todos los \
        Entrar a la página par agenerar el modelo en typescript: https://app.quicktype.io/
    */

    //-------------------------------------------------------------------------------------------------------------------
    constructor(
        private nativeHttp: HTTP,
        private firebaseService: FirebaseService
    ) {
        super();
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public getAsync(url: string, specificProperty?: string): Promise<GenericWebResponseModel> {
        if (isPlatform('capacitor')) {
            return this.getAsyncCapacitor(url, specificProperty);
        } else {
            return this.getAsyncWeb(url, specificProperty);
        }
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public postAsync(url: string, strXml: any, specificProperty?: string): Promise<GenericWebResponseModel> {
        if (isPlatform('capacitor')) {
            return this.postAsyncCapacitor(url, strXml, specificProperty);
        } else {
            return this.postAsyncWeb(url, strXml, specificProperty);
        }
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    private getAsyncCapacitor(url: string, specificProperty?: string): Promise<GenericWebResponseModel> {
        return new Promise<GenericWebResponseModel>((resolve) => {
            this.nativeHttp.setDataSerializer('utf8');
            this.nativeHttp.get(url, {}, {
                'Content-type': 'text/xml',
            }).then(resp => {
                const obj = this.fromStrXmlToObj(resp.data, specificProperty);
                const genericWebResponse: GenericWebResponseModel = this.getGenericWebResponse(obj);
                this.showWebLog(url, 'GET', null, resp.data, genericWebResponse, '#BADBB9');
                resolve(genericWebResponse);

            }).catch(err => {
                const genericWebResponse: GenericWebResponseModel = this.getGenericErrorXMLNativeWebResponse(err);
                this.showWebLog(url, 'GET', null, err.error, genericWebResponse, '#FF9A9A', true);
                resolve(genericWebResponse);
            });
        });
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    private getAsyncWeb(url: string, specificProperty?: string): Promise<GenericWebResponseModel> {

        const http = new XMLHttpRequest();
        http.timeout = this.timeoutSeconds * 1000;
        http.open('GET', url, true);

        //Send the proper header information along with the request
        http.setRequestHeader('Content-type', 'text/xml');
        const response = new Promise<GenericWebResponseModel>((resolve) => {
            http.onreadystatechange = ((resp) => {//Call a function when the state changes.
                if (http.readyState === 4) {
                    if (http.status === 200) {
                        const obj = this.fromStrXmlToObj(http.responseText, specificProperty)
                        const genericWebResponse: GenericWebResponseModel = this.getGenericWebResponse(obj);
                        this.showWebLog(url, 'GET', null, http.responseText, genericWebResponse, '#BADBB9');
                        resolve(genericWebResponse);
                    }
                    else {
                        const genericWebResponse: GenericWebResponseModel = this.getGenericErrorXMLWebResponse(http);
                        this.showWebLog(url, 'GET', null, http.responseText, genericWebResponse, '#FF9A9A', true);
                        resolve(genericWebResponse);
                    }
                }
            });
        });

        http.send();
        return response;
    }


    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    private postAsyncCapacitor(url: string, strXml: any, specificProperty?: string): Promise<GenericWebResponseModel> {
        return new Promise<GenericWebResponseModel>((resolve, reject) => {
            this.nativeHttp.setDataSerializer('utf8');
            this.nativeHttp.post(url, strXml, {
                'Content-type': 'text/xml',
                'Accept': 'text/xml',
                'SOAPAction': ''
            }).then(resp => {
                const obj = this.fromStrXmlToObj(resp.data, specificProperty);
                const genericWebResponse: GenericWebResponseModel = this.getGenericWebResponse(obj);
                this.showWebLog(url, 'POST', strXml, resp.data, genericWebResponse, '#5296C2');
                resolve(genericWebResponse);

            }).catch(err => {
                const genericWebResponse: GenericWebResponseModel = this.getGenericErrorXMLNativeWebResponse(err);
                this.showWebLog(url, 'POST', strXml, err.error, genericWebResponse, '#FF9A9A', true);
                resolve(genericWebResponse);
            });
        });
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    private postAsyncWeb(url: string, strXml: any, specificProperty?: string): Promise<GenericWebResponseModel> {

        const parser = new DOMParser();
        const doc = parser.parseFromString(strXml, 'text/xml');

        const http = new XMLHttpRequest();
        http.timeout = this.timeoutSeconds * 1000;

        http.open('POST', url, true);

        //Send the proper header information along with the request
        http.setRequestHeader('Content-type', 'text/xml');
        http.setRequestHeader('SOAPAction', '');

        const response = new Promise<GenericWebResponseModel>((resolve, reject) => {
            http.onreadystatechange = ((resp) => {//Call a function when the state changes.
                if (http.readyState === 4) {
                    if (http.status === 200) {
                        const obj = this.fromStrXmlToObj(http.responseText, specificProperty);
                        const genericWebResponse: GenericWebResponseModel = this.getGenericWebResponse(obj);
                        this.showWebLog(url, 'POST', strXml, http.responseText, genericWebResponse, '#5296C2');
                        resolve(genericWebResponse);
                    }
                    else {
                        const genericWebResponse: GenericWebResponseModel = this.getGenericErrorXMLWebResponse(http);
                        this.showWebLog(url, 'POST', strXml, http.status, genericWebResponse, '#FF9A9A', true);
                        resolve(genericWebResponse);
                    }
                }
            });
        });

        http.send(doc);
        return response;
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    private showWebLog(url: string, method: string, sentData: any, receivedData: any, objData: any, color: string, error: boolean = false) {
        if (SHOW_WEBSERVICE_RESPONSES) {
            console.log('%cINICIO - - - \nrespuesta servicio ' + method + ': ' + url, 'background-color: ' + color);
            if (sentData != null) {
                console.log('%cobjeto enviado: ', 'background-color: ' + color);
                console.log(sentData);
            }
            console.log('%crespuesta recibida: ', 'background-color: ' + color);
            console.log(receivedData)
            console.log(objData);
            console.log('%cFIN - - - ', 'background-color: ' + color);
        }
        if (FIREBASE_LOG && error) {
            const log: FirebaseWebResponseLogModel = {
                endpoint: url,
                jsonRequest: JSON.stringify(sentData),
                jsonResponse: JSON.stringify(receivedData),
                method: method,
                type: "SOAP",
                headers: null
            }
            ERROR_HANDLER.addWebError(log);
        }
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    private fromObjectToGETString(obj: any) {
        let link = '?';
        Object.keys(obj).forEach(key => link = link + key + '=' + obj[key] + '&')
        return link.slice(0, -1);
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    private fromStrToXML(strXml: string): HTMLElement {
        const xml = document.createElement('response');
        xml.innerHTML = strXml.trim();
        return xml;
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    private fromStrXmlToObj(strXml: string, specificProperty?: string): any {
        const xml = this.fromStrToXML(strXml);
        console.log(xml);
        return this.fromXmlToObj(xml, specificProperty);
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // @specificProperty: return the object from the specific property.
    private fromXmlToObj(xml: HTMLElement, specificProperty?: string): any {
        let dirtyObj: any = this.fromXmlToDirtyObjectRecursive(xml);
        dirtyObj = this.objTextTrashArrayCleanerRecursive(this.objTextStringCleanerRecursive(dirtyObj));

        let cleanObj: any = null;
        if (specificProperty != null) {
            this.getObjFromSpecificProperty(dirtyObj, specificProperty, cObj => {
                cleanObj = cObj;
            });
        }
        return cleanObj != null ? cleanObj : dirtyObj;
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // de un ubjeto javascript busca una propiedad con el nombre pasado coomo parámetro, si lo encentra, es lo que regresa.
    private getObjFromSpecificProperty(obj: any, specificProperty: string, callback: any): any {
        for (const objKey of Object.keys(obj)) {
            const key = objKey;
            if (key.toUpperCase() === specificProperty.toUpperCase()) {
                callback(obj[key]);
                return;
            } else if (typeof obj[key] == 'object') {
                this.getObjFromSpecificProperty(obj[key], specificProperty, callback);
            }
        }
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Limpia el parseo de objetos para que la conversión no se vea como: MENSAJE: {#text: 'hola'} y sea: MENSAJE: 'hola'.
    private objTextStringCleanerRecursive(obj: any) {
        for (const objKey of Object.keys(obj)) {
            const key = objKey;
            if (key === '#text' && Object.keys(obj).length === 1) {
                obj = obj[key];
            } else if (typeof obj[key] == 'object' && key !== '#text') {
                obj[key] = this.objTextStringCleanerRecursive(obj[key]);
            }
        }
        return obj;
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Quita todos los residuos de los campos que tengan #text
    private objTextTrashArrayCleanerRecursive(obj: any) {
        Object.keys(obj).forEach(key => {
            if (key === '#text') {
                delete obj[key];
            } else if (typeof obj[key] == 'object') {
                return this.objTextTrashArrayCleanerRecursive(obj[key]);
            }
        });

        return obj;
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Convierte un xml en un objeto javascript con propiedades sucias que deben ser limpiadas posteriormente.
    private fromXmlToDirtyObjectRecursive(xml: HTMLElement): any {
        let obj = {};
        let i: any;
        let item: any;
        let nodeName: any;
        let old: any;
        if (xml.nodeType === 3) { // text
            obj = xml.nodeValue;
        }

        // do children
        if (xml.hasChildNodes()) {
            for (i = 0; i < xml.childNodes.length; i = i + 1) {
                item = xml.childNodes.item(i);
                nodeName = item.nodeName;
                // console.log('-' + nodeName)
                if ((obj[nodeName]) === undefined) {
                    obj[nodeName] = this.fromXmlToDirtyObjectRecursive(item);
                } else {
                    if ((obj[nodeName].push) === undefined) {
                        old = obj[nodeName];
                        obj[nodeName] = [];
                        obj[nodeName].push(old);
                    }
                    obj[nodeName].push(this.fromXmlToDirtyObjectRecursive(item));
                }
            }
        }
        return obj;
    }

}
