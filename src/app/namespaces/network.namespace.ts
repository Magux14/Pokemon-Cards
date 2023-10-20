import { BehaviorSubject } from 'rxjs';

export var networkObserver$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(null);
export namespace NETWORK {
    export function hasInternet(): boolean {
        return networkObserver$.getValue();
    }
}