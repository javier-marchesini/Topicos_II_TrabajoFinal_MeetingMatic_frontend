import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { User } from './models';
import { AuthenticationService } from './services';

@Component({
    selector: 'app-root',
    templateUrl: './app.component.html',
    styleUrls: ['./app.component.css']
})
export class AppComponent {

    title = 'meeting-o-matic';
    currentUser: User = null;
    
    constructor(
        private router: Router,
        private _authenticationService: AuthenticationService
    ) {
        this._authenticationService.currentUser.subscribe(x => this.currentUser = x);
        
        
        
    }

    logout() {
        this._authenticationService.logout(false);
        this.router.navigate(['/login']);
    }
}



