import { QueryConstraint } from "firebase/firestore";

export class FirebaseWebResponseLogModel {
    lastRoute?: string;
    endpoint: string;
    jsonRequest: string;
    jsonResponse: string;
    soapResponse?: any;
    type: string; // REST | SOAP
    method: string; // GET | POST | PUT | DELETE
    headers: { [str: string]: string };
}

export class FirebaseLogRecordModel {
    deviceUuid: string;
    prod: boolean;
    fecha: Date;
    usuario: string;
    dispositivo: string;
    appVersion: string;
    lstRouteLog: string[];
    webview: string;
    lstErrors: string[];
    lstWebErrors: FirebaseWebResponseLogModel[];
}

export interface FirebaseResponseLog {
    collection: string;
    receivedData?: any;
    firebaseId?: string;
    queryConstraints?: QueryConstraint[];
    color: string
}