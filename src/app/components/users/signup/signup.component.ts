import { HttpErrorResponse } from '@angular/common/http';
import { Route } from '@angular/compiler/src/core';
import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { AuthenticationService } from 'src/app/services';
import { SignUpFormValidator } from './signup-validator.component';

@Component({
	selector: 'app-signup',
	templateUrl: './signup.component.html',
	styleUrls: []
})
export class SignupComponent {

	public signUpForm: FormGroup;
	public displayLoading: Boolean = false;

	constructor(private formBuilder: FormBuilder,
		private _authenticationService: AuthenticationService,
		private _toastService: ToastrService,
		private router: Router
	) {

		if (this._authenticationService.currentUserValue) {
			this.router.navigate(['/user/meetings/board']);
		}


		this.createSignUpForm();


	}

	createSignUpForm() {

		let regexPassword = '^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,}$';

		this.signUpForm = this.formBuilder.group({
			name: new FormControl(null, [Validators.required]),
			email: new FormControl(null, [Validators.required, Validators.pattern("^[a-z0-9._%+-]+@[a-z0-9.-]+\\.[a-z]{2,4}$")]),
			password: new FormControl('', [Validators.required, Validators.pattern(regexPassword)],),
			passwordConfirm: new FormControl('', [Validators.required, Validators.pattern(regexPassword)])
		}, { validator: [SignUpFormValidator.validateConfirmPassword()] })

	}

	onSubmit() {

		this.displayLoading = true;

		let formValues = this.signUpForm.value;
		delete formValues.passwordConfirm;
		this._authenticationService.signup(this.signUpForm.value)
			.subscribe(
				response => {
					this.router.navigate(['user/meetings/board']);
				},
				(error: HttpErrorResponse) => {
					if (error.status == 402) {
						this._toastService.error('Ha ocurrido un error: El usuario ' + this.signUpForm.get('email').value + ' ya se se encuentra registrado');
					} else {
						throw error;
					}

				})
			.add(() => this.displayLoading = false);
	}

}
