import { ErrorHandler, Injector, Injectable, NgZone } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';



@Injectable()
export class ErrorHandlerGlobal implements ErrorHandler {


    constructor(private injector: Injector, private zone: NgZone) {

    }

    handleError(error: any) {
        const router = this.injector.get(Router);
        const errorDTO = {
            titulo: null,
            mensaje: null,
            descripcion: null,
        };

        errorDTO.titulo = 'ERROR INESPERADO';
        errorDTO.mensaje = error.message;
        errorDTO.descripcion = error.stack;

        this.zone.run(() => router.navigate(['/error'], { queryParams: errorDTO }));
    }

}

		