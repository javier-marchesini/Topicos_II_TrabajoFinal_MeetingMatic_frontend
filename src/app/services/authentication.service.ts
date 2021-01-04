
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { User } from '../models';
import { AccountType } from '../models/user-accountType.model';
import { HttpBaseService } from './http-base.service';


@Injectable({ providedIn: 'root' })
export class AuthenticationService extends HttpBaseService {
    private currentUserSubject: BehaviorSubject<User>;
    public currentUser: Observable<User>;
    private readonly SESSION_DATA_KEY = 'sessionData';

    constructor(private http: HttpClient,
                 private router: Router,
    ) {
        super();
        this.currentUserSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem(this.SESSION_DATA_KEY)));
        this.currentUser = this.currentUserSubject.asObservable();
    }

    public get currentUserValue(): any {
        return this.currentUserSubject.value;
    }

    public setCurrentUserValue(user: User) {
        this.currentUserSubject.next(user);
    }

    signup(signUpFormData: any) {
        return this.http.post<any>(`${environment.apiUrl}/signup`, signUpFormData);
    }

    login(loginFormValues: any) {
        return this.http.post<any>(`${environment.apiUrl}/users/login`, loginFormValues)
            .pipe(map(sessionData => {
                let userData = sessionData.userData
                this.saveSession(userData);
                this.setCurrentUserValue(userData);
                return userData;
            }));
    }

    logout(redirect: Boolean) {
        localStorage.removeItem(this.SESSION_DATA_KEY);
        this.setCurrentUserValue(null);
        if (redirect) {
            this.router.navigate([''])
                .then(() => {
                    window.location.reload();
                });

        }
    }




    private saveSession(sessionData: any): Boolean {

        let currentSession = localStorage.getItem(this.SESSION_DATA_KEY);
        if (currentSession) {
            return false;
        } else {
            localStorage.setItem(this.SESSION_DATA_KEY, JSON.stringify(sessionData));
            this.setCurrentUserValue(sessionData);
            return true;
        }
    }


    getSession() {
        let currentSession = localStorage.getItem(this.SESSION_DATA_KEY);
        if (currentSession) {
            return JSON.parse(currentSession)
        }
        return null
    }

    sessionExists(): Boolean {
        return (this.getSession()) ? true : false;
    }

    getToken(): String {
        return this.getSession().token;
    }

    getUserId(): String {

        return this.getSession().id;
    }

    getEmail(): String {
        return this.getSession().email;
    }

    getName(): String {
        return this.getSession().name;
    }
    getAccountType(): String {
        return this.getSession().accountType;
    }

    getRol(): String {
        return this.getSession().roles[0];
    }

    isFreeAccountType(): Boolean {
        return this.getAccountType() === AccountType.FREE;
    }

    setUserData(value: User) {
        this.currentUserSubject.next(value);
    }

    getUserData() {
        return this.currentUserSubject.asObservable();
    }


}