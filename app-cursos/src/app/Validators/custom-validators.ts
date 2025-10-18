import { AbstractControl, ValidationErrors } from "@angular/forms";

export function passwordsMatchValidator(form: AbstractControl): ValidationErrors | null {
  
  const password = form.get('password');
  const confirmPassword = form.get('confirmPassword');


  if (!password || !confirmPassword) {
    return null;
  }
  
  if (password.value !== confirmPassword.value) {
    confirmPassword.setErrors({ passwordsMismatch: true }); 
    return { passwordsMismatch: true }; 
  } 
  else {
    if (confirmPassword.hasError('passwordsMismatch')) {
      confirmPassword.setErrors(null);
    }
    return null; 
  }
}