import { BehaviorSubject } from 'rxjs';

export var eventObserver$: BehaviorSubject<any> = new BehaviorSubject<CustomEvent>(null);
export interface CustomEvent {
    id: string;
    data: any;
}