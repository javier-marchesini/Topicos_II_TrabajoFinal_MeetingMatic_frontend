import { Injectable } from '@angular/core';
import { Router, CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { AuthenticationService } from '../services';


@Injectable({ providedIn: 'root' })
export class AuthGuard implements CanActivate {
    constructor(
        private router: Router,
        private authenticationService: AuthenticationService,
        private _toastService: ToastrService,
    ) { }

    canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot) {
        
        const currentUser = this.authenticationService.currentUserValue;
        
        if (currentUser) {

            if (route.data.roles && route.data.roles.indexOf(currentUser.roles[0]) === -1) {
                
                this._toastService.error('Acceso no autorizado');
                this.router.navigate(['/']);
                return false;
            }
            return true;
        }

        
        this.router.navigate(['/user/signin'], { queryParams: { returnUrl: state.url } });
        return false;
    }
}