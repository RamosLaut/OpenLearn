import { Component, OnInit } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { MemberService } from '../../services/member-service';
import { ActivatedRoute, Router } from '@angular/router';
import { MemberRegistration } from '../../models/memberRegistration';
import { passwordsMatchValidator } from '../../Validators/custom-validators';

@Component({
  selector: 'app-register-form-page',
  imports: [ReactiveFormsModule],
  templateUrl: './register-form-page.html',
  styleUrl: './register-form-page.css'
})
export class RegisterFormPage {

  registerForm: FormGroup
  userName: FormControl
  email: FormControl
  fullName: FormControl
  password: FormControl
  confirmPassword: FormControl

  constructor(private memberService: MemberService, private router: Router){
    this.userName= new FormControl('', [Validators.required, Validators.maxLength(30)])
    this.email= new FormControl('', [Validators.required, Validators.email])
    this.fullName= new FormControl('', [Validators.required, Validators.minLength(3), Validators.maxLength(50)])
    this.password= new FormControl('', [Validators.required, Validators.pattern('^(?=.*[A-Z])(?=.*\\d)[A-Za-z\\d]{8,}$')])
    this.confirmPassword= new FormControl('', [Validators.required])

    this.registerForm=new FormGroup({  
      userName: this.userName,
      email: this.email,
      fullName: this.fullName,  
      password: this.password,
      confirmPassword: this.confirmPassword
    },
    {
      validators: passwordsMatchValidator
    });
  }


  ngSubmit(){
  if (this.registerForm.invalid) {
    return;
  }

  const {confirmPassword, ...data} = this.registerForm.value;

  const memberToSend: MemberRegistration = data;

  this.memberService.post(memberToSend).subscribe({
    next: () => { console.log('user successfully registered');
    this.router.navigate(['/login']);
    },
    error: (e) => {console.log('registration failure: ', e)}
  })
  
}

}
