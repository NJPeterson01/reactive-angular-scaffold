import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { User } from "../model/user";
import { map, shareReplay, tap } from "rxjs/operators";
import { HttpClient } from "@angular/common/http";

/*
    Auth stores are very common in applications, to maintain
    login states, but can be very dangerous. Never save a JWT
    or other token that holds sensitive user information into the browser.
    Only store simple ID tokens that the backend can validate
    to ensure the session is still live. These tokens should
    expire in less than 30 minutes.
*/

// Local storage key
const AUTH_DATA = "auth_data";

@Injectable({
    providedIn: 'root'
})
export class AuthStore {

    private subject = new BehaviorSubject<User>(null);

    user$: Observable<User> = this.subject.asObservable();
    
    isLoggedIn$: Observable<boolean>;
    isLoggedOut$: Observable<boolean>;

    constructor(private http: HttpClient) {

        this.isLoggedIn$ = this.user$.pipe(map(user => !!user));
        this.isLoggedOut$ = this.isLoggedIn$.pipe(map(loggedIn => !loggedIn));

        const user = localStorage.getItem(AUTH_DATA);

        if (user) {
            this.subject.next(JSON.parse(user));
        }
    }

    /*
     Any sensitive data should be encrypted before being sent to backend
    */
    login(email: string, password: string): Observable<User> {
        return this.http.post<User>("/api/login", {email, password})
            .pipe(
                tap(user => {
                    this.subject.next(user);

                    // Localstorage is a key-value database that only allows strings
                    localStorage.setItem(AUTH_DATA, JSON.stringify(user));
                }),
                shareReplay()
            );
    }

    logout(): void {
        this.subject.next(null);
        localStorage.removeItem(AUTH_DATA);
    }

}