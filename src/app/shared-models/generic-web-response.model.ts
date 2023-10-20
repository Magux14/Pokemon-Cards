import { HttpErrorResponse } from '@angular/common/http';

export interface GenericWebResponseModel {
    data: any;
    error?: any;
    success: boolean;
    httpStatus: number;
    message: any;
}

export interface NativeHttpXmlError {
    error: string;
    status: number;
}

export interface SendRequestOptionsModel {
    method: 'get' | 'post' | 'put' | 'patch' | 'head' | 'delete' | 'options' | 'upload' | 'download';
    data?: {
        [index: string]: any;
    };
    params?: {
        [index: string]: string | number;
    };
    serializer?: 'json' | 'urlencoded' | 'utf8' | 'multipart' | 'raw';
    timeout?: number;
    headers?: {
        [index: string]: string;
    };
    filePath?: string | string[];
    name?: string | string[];
    responseType?: 'text' | 'arraybuffer' | 'blob' | 'json';
}

export interface DownloadResponseAdvanceHttp {
    filesystem: FileSystem;
    fullPath: string;
    isDirectory: boolean;
    isFile: boolean;
    nativeURL: string;
}

export interface HttpNativeOptions {
    timeout?: number;
}

export class GenericWebResponseConverter {

    public timeoutSeconds = 60;

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    public getGenericWebResponse(data: any, httpStatus: number = 200): GenericWebResponseModel {
        return {
            data,
            httpStatus,
            success: true,
            message: null
        };
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    public getGenericErrorWebResponse(err: HttpErrorResponse): GenericWebResponseModel {
        return {
            data: null,
            error: err.error,
            httpStatus: err.status,
            success: err.ok ? err.ok : false,
            message: err.message
        };
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    // For capacitor
    public getGenericErrorNativeWebResponse(err: any): GenericWebResponseModel {
        return {
            data: null,
            error: this.tryJsonParse(err.error),
            httpStatus: err.status,
            success: false,
            message: JSON.stringify(err)
        };
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    public getGenericErrorXMLWebResponse(err: XMLHttpRequest): GenericWebResponseModel {
        return {
            data: null,
            httpStatus: err.status,
            success: false,
            message: err.responseText
        };
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    public getGenericErrorXMLNativeWebResponse(err: NativeHttpXmlError): GenericWebResponseModel {
        return {
            data: null,
            httpStatus: err.status,
            success: false,
            message: err.error
        };
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    public tryJsonParse(obj: any) {
        try {
            return JSON.parse(obj);
        } catch (err) {
            return obj;
        }
    }
}
