import { HttpErrorResponse } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { FormGroup, FormBuilder, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { first } from 'rxjs/operators';
import { Rol } from 'src/app/models/rol.model';
import { AuthenticationService } from 'src/app/services';

@Component({
    selector: 'app-signin',
    templateUrl: './signin.component.html',
    styleUrls: ['./signin.component.css']
})
export class SigninComponent implements OnInit {

    public loginForm: FormGroup;
    public displayLoading: Boolean = false;
    private 

    constructor(
        private _authenticationService: AuthenticationService,
        private formBuilder: FormBuilder,
        private router: Router,
        private _toastService: ToastrService,
    ) {

      this.redirect();

    }


    redirect(){
        if (this._authenticationService.currentUserValue) {
            console.log(this._authenticationService.getRol());
            if (this._authenticationService.getRol() == Rol.ADMIN){
                this.router.navigate(['/admin/board']);
            }else{
                this.router.navigate(['/user/meetings/board']);
            }
        }
    }

    ngOnInit(): void {
        this.loginForm = this.formBuilder.group({
            email: ['', Validators.required],
            password: ['', Validators.required]
        });
    }


    onSubmit() {

        if (this.loginForm.invalid) {
            return;
        }
        this.displayLoading = true;
        this._authenticationService.login(this.loginForm.value)
            .pipe(first())
            .subscribe(
                () => {
                    this.redirect();
                   // this.router.navigate(['/user/meetings/board']);
                },
                (error: HttpErrorResponse) => {
                   
                    if (error.status == 401) {
                        this._toastService.error('Acceso no autorizado');
                    } else {
                        throw error;
                    }

                })
            .add(() => this.displayLoading = false);
    }

}
