import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services';

@Component({
    selector: 'app-user-profile',
    templateUrl: './user-profile.component.html',
    styleUrls: ['./user-profile.component.css']
})
export class UserProfileComponent implements OnInit {

    public currentUser = null
    public isFreeAccountType:Boolean  = false;
    
    constructor(private _authenticationService: AuthenticationService) { }
    
    
    ngOnInit(): void {
        this.currentUser = this._authenticationService.currentUserValue;
        this.isFreeAccountType = this._authenticationService.isFreeAccountType();
        
    }

}
