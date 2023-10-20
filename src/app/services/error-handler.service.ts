import { ErrorHandler, Injectable } from '@angular/core';
import { ERROR_HANDLER } from '../namespaces/error-handler.namespace';

@Injectable()
export class ErrorHandlerService implements ErrorHandler {

    // NO agregar ninguna otra inyección a este servicio ya que causará una dependencia circular.
    // -----------------------------------------------------------------------------------------------------------------
    constructor(
    ) {
    }

    // - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - - -|
    public handleError(error: any) {
        try {
            console.error(error);
            if (typeof error == 'string') {
                ERROR_HANDLER.addError(error);
            } else if (error.stack) {
                ERROR_HANDLER.addError(error.stack);
            }
        } catch (err) {
            console.log('%c' + error, 'color: ' + 'red; background-color: ' + '#FFECEC');
        }
    }

}