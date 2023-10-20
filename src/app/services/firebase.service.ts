import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FirebaseLogRecordModel, FirebaseResponseLog } from '../shared-models/firebase.model';
import { NETWORK } from '../namespaces/network.namespace';
import { GenericWebResponseModel } from '../shared-models/generic-web-response.model';
import { errorObserver$, webErrorObserver$ } from '../app.component';
import { Device, DeviceInfo } from '@capacitor/device';
import { ROUTE_LOG } from '../namespaces/route-log.namespace';
import { UtilitiesService } from './utilities.service';
import { Firestore, collectionData, collection, DocumentData, CollectionReference, query, QueryConstraint } from '@angular/fire/firestore';
import { addDoc, deleteDoc, doc, DocumentReference, getDoc, updateDoc } from 'firebase/firestore';
import { Auth, getAuth, signInAnonymously, signInWithEmailAndPassword, signOut, UserCredential } from "firebase/auth";
import { SHOW_WEBSERVICE_RESPONSES } from '../constants';

@Injectable({
  providedIn: 'root'
})
export class FirebaseService {

  private auth: Auth;

  //-------------------------------------------------------------------------------------------------------------------
  constructor(
    private firestore: Firestore,
    private utilitiesService: UtilitiesService
  ) {
    this.auth = getAuth();
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
  public async authAnonymously(): Promise<[boolean, string | UserCredential]> {
    try {
      const sign: UserCredential = await signInAnonymously(this.auth);
      this.utilitiesService.colorConsoleLog('autenticado en firebase', sign, 'yellow');
      return [true, sign];
    } catch (err) {
      this.utilitiesService.colorConsoleLog('no fue posible autenticar con firebase', err, '#FF9A9A');
      return [false, err.code + ' ' + err.message];
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async firebaseAuthEmailPassword(email: string, password: string): Promise<[boolean, string | UserCredential]> {
    try {
      const sign: UserCredential = await signInWithEmailAndPassword(this.auth, email, password);
      this.utilitiesService.colorConsoleLog('autenticado en firebase', sign, 'yellow');
      return [true, sign];
    } catch (err) {
      this.utilitiesService.colorConsoleLog('no fue posible autenticar con firebase', err, '#FF9A9A');
      return [false, err.code + ' ' + err.message];
    }
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async firebaseLogout() {
    await signOut(this.auth);
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  // Falta editar esto para que me regrese el firebase ID que se generaraá.
  public async addGenericRecord<T>(strCollection: string, object: T): Promise<DocumentReference> {
    object = this.setNullOnUndefined(object);
    if (!this.limitDataApproval(JSON.stringify(object))) {
      return null;
    }

    if (!NETWORK.hasInternet()) {
      return null;
    }

    const collectionRef: CollectionReference<DocumentData> = collection(this.firestore, strCollection);
    return await this.addDoc(collectionRef, object).catch(() => null);
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
  private async addDoc(collectionRef: CollectionReference<DocumentData>, object: any): Promise<DocumentReference> {
    return new Promise(async resolve => {
      const documentReference: DocumentReference = await this.utilitiesService.promiseRaceSetTimeout(addDoc(collectionRef, object), 2_000, null).catch(() => false);
      return resolve(documentReference)
    });
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async updateRecord<T>(strCollection: string, firebaseId: string, obj: any): Promise<boolean> {
    const docRef: DocumentReference<DocumentData> = doc(this.firestore, strCollection, firebaseId);
    const resp = await updateDoc(docRef, obj).catch(() => null);
    if (!resp) {
      return false;
    }
    return true;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public async deleteRecord<T>(strCollection: string, firebaseId: string): Promise<boolean> {
    const docRef: DocumentReference<DocumentData> = doc(this.firestore, strCollection, firebaseId);
    const resp = await deleteDoc(docRef).catch(() => null);
    if (!resp) {
      return false;
    }
    return true;
  }


  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public setNullOnUndefined(obj: any): any {
    for (const objKey of Object.keys(obj)) {
      const key = objKey;
      if (obj[key] === undefined) {
        obj[key] = null;
      } else if (obj[key] && typeof obj[key] == 'object') {
        obj[key] = this.setNullOnUndefined(obj[key]);
      }
    }
    return obj;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public limitDataApproval(strObj: string): boolean {
    const bytes: number = new Blob([strObj]).size;
    console.log(bytes + ' bytes, adding to firebase log');
    if (bytes > 950_000) {
      console.error(bytes + ' bytes, record too big for firebase storage', strObj);
      return false;
    }

    return true;
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
  public async getCollectionDocuments(strCollection: string): Promise<GenericWebResponseModel> {
    const collectionRef: CollectionReference<DocumentData> = collection(this.firestore, strCollection);
    return new Promise(resolve => {
      const subscription = collectionData(collectionRef, { idField: 'firebaseId' }).subscribe(items => {
        subscription.unsubscribe();
        const resp = this.getGenericFirebaseResponse(items);
        this.showFirebaseResponseLog({
          collection: strCollection,
          color: 'yellow',
          receivedData: items
        });
        return resolve(resp);
      }, err => {
        console.error(err);
        subscription.unsubscribe();
        const resp = this.getGenericFirebaseResponseError(err);
        this.showFirebaseResponseLog({
          collection: strCollection,
          color: '#FF9A9A',
        });
        return resolve(resp);
      });
    });
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
  public async getDocumentById(strCollection: string, firebaseId: string): Promise<GenericWebResponseModel> {
    const docRef: DocumentReference<DocumentData> = doc(this.firestore, strCollection, firebaseId);
    const docSnap = await getDoc(docRef).catch(() => null);
    if (!docSnap) {
      return null;
    }

    const obj = docSnap.data();
    if (obj) {
      obj.firebaseId = firebaseId
    }
    return obj;
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
  // queryConstraints -> [where('dispositivo', '==', 'iphone'), where('appVersion', '==', '2')]
  public async getCollectionDocumentsByQuery(strCollection: string,
    queryConstraints: QueryConstraint[]): Promise<GenericWebResponseModel> {
    const collectionRef: CollectionReference<DocumentData> = collection(this.firestore, strCollection);
    const q = query(collectionRef, ...queryConstraints)
    return new Promise(resolve => {
      const subscription = collectionData(q, { idField: 'firebaseId' }).subscribe(items => {
        subscription.unsubscribe();
        return resolve({
          data: items,
          httpStatus: 200,
          success: true,
          message: null
        });
      }, err => {
        console.error(err);
        subscription.unsubscribe();
        return resolve({
          data: [],
          httpStatus: 404,
          success: false,
          message: err
        });
      });
    });
  }

  // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
  public async listenerErrores() {

    const deviceInfo: DeviceInfo = await Device.getInfo();
    const deviceUuid: string = (await Device.getId()).uuid;
    const appInfo = await this.utilitiesService.getAppInfoAsync();
    let appVersion: string;
    if(appInfo){
      appVersion = appInfo.version;
    }

    errorObserver$.subscribe(async error => {
      if (!error) {
        return;
      }

      if (!NETWORK.hasInternet()) {
        return;
      }

      let record: FirebaseLogRecordModel = {
        deviceUuid,
        prod: environment.production,
        fecha: new Date(),
        usuario: 'set your user',
        dispositivo: deviceInfo.model + ' (' + deviceInfo.operatingSystem + ' ' + deviceInfo.osVersion + ')',
        webview: window.navigator.userAgent,
        appVersion: appVersion,
        lstRouteLog: ROUTE_LOG.getRoutes(),
        lstErrors: [error],
        lstWebErrors: []
      }
      if (!this.limitDataApproval(JSON.stringify(record))) {
        return;
      }
      record = this.setNullOnUndefined(record);
      let strCollection: string = 'errores_codigo';
      if (environment.production) {
        strCollection += '_prod';
      }
      const collectionRef: CollectionReference<DocumentData> = collection(this.firestore, strCollection);
      await addDoc(collectionRef, record).catch(() => null);
    });

    webErrorObserver$.subscribe(async httpError => {
      if (!httpError) {
        return;
      }

      if (!NETWORK.hasInternet()) {
        return;
      }

      let record: FirebaseLogRecordModel = {
        deviceUuid,
        prod: environment.production,
        fecha: new Date(),
        usuario: 'set your user',
        dispositivo: deviceInfo.model + ' (' + deviceInfo.operatingSystem + ' ' + deviceInfo.osVersion + ')',
        webview: window.navigator.userAgent,
        appVersion: appVersion,
        lstRouteLog: ROUTE_LOG.getRoutes(),
        lstErrors: [],
        lstWebErrors: [httpError]
      }
      if (!this.limitDataApproval(JSON.stringify(record))) {
        return;
      }
      record = this.setNullOnUndefined(record);
      let strCollection: string = 'errores_codigo';
      if (environment.production) {
        strCollection += '_prod';
      }
      const collectionRef: CollectionReference<DocumentData> = collection(this.firestore, strCollection);
      await addDoc(collectionRef, record).catch(() => null);
    });
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public getGenericFirebaseResponse(data: any): GenericWebResponseModel {
    return {
      data,
      httpStatus: 200,
      success: true,
      message: null
    };
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  public getGenericFirebaseResponseError(err: any): GenericWebResponseModel {
    return {
      data: [],
      httpStatus: 200,
      success: true,
      message: err
    };
  }

  //- - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -
  private showFirebaseResponseLog(firebaseResponseLog: FirebaseResponseLog) {
    if (SHOW_WEBSERVICE_RESPONSES) {
      console.log('%cINICIO - - - \nrespuesta firebase: ', 'background-color: ' + firebaseResponseLog.color);
      console.log('%ccollección: ' + firebaseResponseLog.collection, 'background-color: ' + firebaseResponseLog.color);
      if (firebaseResponseLog.queryConstraints) {
        console.log(firebaseResponseLog.queryConstraints);
      }
      console.log('%crespuesta recibida: ', 'background-color: ' + firebaseResponseLog.color);
      console.log(firebaseResponseLog.receivedData)
      console.log('%cFIN - - - ', 'background-color: ' + firebaseResponseLog.color);
    }
  }


}
