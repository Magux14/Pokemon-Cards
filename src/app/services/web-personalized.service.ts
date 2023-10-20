import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { WebRestService } from './web-rest.service';
import { WebSoapService } from './web-soap.service';
import { environment } from 'src/environments/environment';
import { GenericWebResponseModel, SendRequestOptionsModel } from '../shared-models/generic-web-response.model';

@Injectable()

// Clase personalizada para endpoints.
export class WebPersonalizedService {

    public customAbcHeaders: { [str: string]: string } = {
        'responseType': 'text',
        'x-api-key': environment.apikey,
        'x-mock-match-request-body': `${environment.production}`
    };

    //-------------------------------------------------------------------------------------------------------------------
    constructor(
        public http: HttpClient,
        private webRestService: WebRestService,
        private webSoapServie: WebSoapService
    ) {
    }

    /* REST */

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Hace una petición GET genérica REST
    public getAsync(url: string, headers?: { [str: string]: string }, isUri: boolean = true): Promise<GenericWebResponseModel> {
        url = isUri ? (environment.gateway + url) : url;
        return this.webRestService.getAsync(url, headers == null ? this.customAbcHeaders : headers);
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Hace una petición POST genérica REST
    public postAsync(url: string, objeto: any, headers?: { [str: string]: string }, isUri: boolean = true): Promise<GenericWebResponseModel> {
        url = isUri ? (environment.gateway + url) : url;
        return this.webRestService.postAsync(url, objeto, headers == null ? this.customAbcHeaders : headers);
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Hace una petición PUT genérica REST
    public putAsync(url: string, objeto: any, headers?: { [str: string]: string }, isUri: boolean = true): Promise<GenericWebResponseModel> {
        url = isUri ? (environment.gateway + url) : url;
        return this.webRestService.putAsync(url, objeto, headers == null ? this.customAbcHeaders : headers);
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Hace una petición DELETE genérica REST
    public deleteAsync(url: string, objeto: any, headers?: { [str: string]: string }, isUri: boolean = true): Promise<GenericWebResponseModel> {
        url = isUri ? (environment.gateway + url) : url;
        return this.webRestService.deleteAsync(url, objeto, headers == null ? this.customAbcHeaders : headers);
    }
    
    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    public sendRequestCapacitorAsync(url: string, options: SendRequestOptionsModel, isUri: boolean = true): Promise<GenericWebResponseModel> {
        url = isUri ? (environment.gateway + url) : url;
        if(options.headers == null){
            options.headers = this.customAbcHeaders;
        }
        return this.webRestService.sendRequestCapacitorAsync(url, options);
    }

    /* SOAP */

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Hace una petición GET genérica REST
    public getSoapAsync(url: string, specificProperty?: string, isUri: boolean = true): Promise<any> {
        url = isUri ? (environment.gateway + url) : url;
        return this.webSoapServie.getAsync(url, specificProperty);
    }

    //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
    // Hace una petición POST genérica REST
    public postSoapAsync(url: string, objeto: any, specificProperty?: string, isUri: boolean = true): Promise<any> {
        url = isUri ? (environment.gateway + url) : url;
        return this.webSoapServie.postAsync(url, objeto, specificProperty);
    }

}