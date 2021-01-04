import { Injectable, Injector, NgZone, ɵConsole } from '@angular/core';
import { HttpRequest, HttpHandler, HttpEvent, HttpInterceptor, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { AuthenticationService } from '../services';
import { Router } from '@angular/router';
import { ERROR_COMPONENT_TYPE } from '@angular/compiler';
import { ToastrService } from 'ngx-toastr';



@Injectable()
export class HttpErrorInterceptor implements HttpInterceptor {



    constructor(
        private injector: Injector, private zone: NgZone,
        private _authenticationService: AuthenticationService,
        private _toastService: ToastrService) { }


    intercept(request: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {

        return next.handle(request).pipe(


            catchError(error => {
                const router = this.injector.get(Router);

                if (error.status === 401) {
                    this._authenticationService.logout(false);
                }

                const errorDTO = {
                    titulo: null,
                    mensaje: null,
                    descripcion: null,
                };

                errorDTO.titulo = error.status + ' | ' + error.error.error.code;
                errorDTO.mensaje = error.error.error.message;
                errorDTO.descripcion = error.message;

//                this.zone.run(() => router.navigate(['/error'], { queryParams: errorDTO }));

                return throwError(error);



            }))
    }



}