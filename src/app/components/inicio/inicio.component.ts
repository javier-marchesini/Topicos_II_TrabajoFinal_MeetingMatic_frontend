import { Component, OnInit } from '@angular/core';
import { AuthenticationService } from 'src/app/services';

@Component({
    selector: 'app-inicio',
    templateUrl: './inicio.component.html',
    styleUrls: ['./inicio.component.css']
})
export class InicioComponent implements OnInit {

    public hasSession:Boolean = false;
    public rol:String = null;
    constructor(private _authenticationService: AuthenticationService,) { 

        this.hasSession = this._authenticationService.sessionExists();
        if (this.hasSession){
            this.rol = this._authenticationService.getRol()
        }

    }

    ngOnInit(): void {
    }

}
