import { FormGroup } from '@angular/forms';

export class SignUpFormValidator {

	static validateConfirmPassword() {
		return (group: FormGroup): { [key: string]: any } => {
        
            let password = group.get('password').value;
			let passwordConfirm = group.get('passwordConfirm').value
            
			if  ( password != passwordConfirm && !(password =='' || passwordConfirm == '') ){
					return { 'password-confirm-invalid': true };
			}
			return null;
		}
    }
}