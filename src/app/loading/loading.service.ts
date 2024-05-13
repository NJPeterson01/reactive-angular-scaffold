import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable, of } from "rxjs";
import { concatMap, finalize, tap } from "rxjs/operators";

// All services are injectables
// A service with no 'providedIn' declaration is an instance
@Injectable()
export class LoadingService {

    // BehvaiorSubject remembers last/initial value emitted.
    // Subjects allow us to emit values to loading$ observable.
    // This is our control mechanism for the observable and should be made private
    private loadingSubject = new BehaviorSubject<boolean>(false);

    // What will be subscribed to by other components
    // Emits values from loading subject as observables
    loading$: Observable<boolean> = this.loadingSubject.asObservable();

    constructor() {
        console.log('Created loading service');
    }

    // We can use generics because it doesn't matter what the observable type is,
    // only that we track its life cycle to either completion or error.
    showLoaderUntilCompleted<T>(obs$: Observable<T>): Observable<T> {
        // 'Of' creates an observable with value.
        // Since the value is null, it completes immediately
        return of(null)
            .pipe(
                // Tap will immediately set the loading to on
                tap(() => this.loadingOn()),
                // Concapt map will combine the starting null obserable into the input observable,
                // making a new observable that based on the input one
                concatMap(() => obs$),
                // Runs once the input observable completes
                finalize(() => this.loadingOff())
            )
    }

    // Manual On and Off methods
    // These methods are inefficient for outside components. 
    // Tracking an observable works better
    loadingOn() {
        this.loadingSubject.next(true);
    }

    loadingOff() {
        this.loadingSubject.next(false);
    }

}