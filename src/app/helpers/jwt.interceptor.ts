import { Injectable } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthenticationService } from '../services';
import { environment } from 'src/environments/environment';


@Injectable()
export class JwtInterceptor implements HttpInterceptor {
    constructor(private _authenticationService: AuthenticationService) { }

    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        
        const TOKEN_HEADER_KEY = 'Authorization';

        if (this._authenticationService.sessionExists()) {

            const currentUser = this._authenticationService.currentUserValue;
            const token = currentUser.token;
            request =  request.clone({ headers: request.headers.set(TOKEN_HEADER_KEY, 'Bearer ' + token) });
          
        }
        
        return next.handle(request);

    }
}