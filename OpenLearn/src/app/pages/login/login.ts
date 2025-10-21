import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { Auth } from '../../services/auth';

@Component({
  selector: 'app-login',
  imports: [RouterLink, ReactiveFormsModule],
  templateUrl: './login.html',
  styleUrl: './login.css'
})
export class Login{
  form!: FormGroup
  errorMsg = '';

  constructor(
    private fb: FormBuilder,
    private auth: Auth,
    private router: Router
  ) {
      this.form = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  onSubmit() {
    if (this.form.valid) {
      const { username, password } = this.form.value;
      this.auth.login(username!, password!).subscribe({
        next: () => this.router.navigate(['/mycourses']),
        error: () => this.errorMsg = 'Username or password invalid'
      });
    }
  }
}
