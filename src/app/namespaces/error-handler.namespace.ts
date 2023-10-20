import { errorObserver$, webErrorObserver$ } from "src/app/app.component";
import { FirebaseWebResponseLogModel } from "../shared-models/firebase.model";
import { ROUTE_LOG } from "./route-log.namespace";

export namespace ERROR_HANDLER {

    let errorsKey: string = 'global-errors';
    let webErrorsKey: string = 'global-web-errors';

    const limitStorageErrors: number = 50_000;
    const limitStorageWebErrors: number = 50_000;

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    export const getErrors = (): string[] => {
        const lstErrors: string[] = JSON.parse(localStorage.getItem(errorsKey)) || [];
        return lstErrors;
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    export const getWebErrors = (): FirebaseWebResponseLogModel[] => {
        const lstWebErrors: FirebaseWebResponseLogModel[] = JSON.parse(localStorage.getItem(webErrorsKey)) || [];
        return lstWebErrors;
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    export const addError = (error: string) => {
        let errorReduced = error.substring(0, 1000);

        const lastRoute = getLastRoute();
        if (lastRoute) {
            errorReduced = 'Current page: ' + lastRoute + '\n' + errorReduced;
        }

        const lstErrors: string[] = getErrors();
        lstErrors.push(errorReduced);
        try {
            if (limitDataApproval(lstErrors.join(), limitStorageErrors)) {
                try {
                    localStorage.setItem(errorsKey, JSON.stringify(lstErrors));
                } catch (err) {
                }
            }
        } catch (err) {
        }
        errorObserver$.next(errorReduced);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    export const addWebError = (firebaseWebResponseLogModel: FirebaseWebResponseLogModel) => {
        const lastRoute = getLastRoute();
        if (lastRoute) {
            firebaseWebResponseLogModel.lastRoute = lastRoute;
        }

        const lstWebErrors: FirebaseWebResponseLogModel[] = getWebErrors();

        try {
            const existeErrorEnLogs = lstWebErrors.find(item => item.endpoint == firebaseWebResponseLogModel.endpoint &&
                item.jsonRequest == firebaseWebResponseLogModel.jsonRequest);
            if (existeErrorEnLogs) {
                return;
            }

            const existeErrorEspefico = lstWebErrors.find(item => item.endpoint == firebaseWebResponseLogModel.endpoint &&
                JSON.parse(firebaseWebResponseLogModel.jsonResponse).error != null &&
                JSON.parse(item.jsonResponse).error == JSON.parse(firebaseWebResponseLogModel.jsonResponse).error);
            if (existeErrorEspefico) {
                return;
            }
        } catch (err) {

        }

        lstWebErrors.push(firebaseWebResponseLogModel);
        try {
            if (limitDataApproval(JSON.stringify(limitStorageWebErrors)), 95_000) {
                try {
                    localStorage.setItem(webErrorsKey, JSON.stringify(lstWebErrors));
                } catch (err) {
                }
            }
        } catch (err) {
        }
        webErrorObserver$.next(firebaseWebResponseLogModel);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    export const cleanErrors = () => {
        localStorage.removeItem(errorsKey);
        localStorage.removeItem(webErrorsKey);
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    function limitDataApproval(strObj: string, maxSize: number = 999_000): boolean {
        let bytes: number = new Blob([strObj]).size;
        if (bytes > maxSize) {
            console.error(bytes + ' bytes, record too big for firebase storage', strObj);
            return false;
        }

        return true;
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    function getLastRoute() {
        const lstRoutes: string[] = ROUTE_LOG.getRoutes();
        if (lstRoutes.length > 0) {
            return lstRoutes[lstRoutes.length - 1];
        }

        return null;
    }

}

