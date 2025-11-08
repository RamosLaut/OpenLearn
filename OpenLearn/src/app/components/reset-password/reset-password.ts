import { Component, OnInit } from '@angular/core';
import { AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, ValidationErrors, Validators } from '@angular/forms';
import { Auth } from '../../services/auth';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './reset-password.html',
  styleUrl: './reset-password.css'
})
export class ResetPassword implements OnInit {
  resetForm!: FormGroup;
  errorMessage = '';
  private userEmail: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: Auth,
    private router: Router,
    private route: ActivatedRoute
  ) { }

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.userEmail = params['email'] || '';

      this.resetForm = this.fb.group({
        email: [{ value: this.userEmail, disabled: true }, Validators.required],
        code: ['', Validators.required],
        newPassword: ['', [Validators.required, Validators.minLength(8)]],
        confirmPassword: ['', Validators.required]
      }, {
        validators: this.passwordMatchValidator
      });
    });
  }

  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const newPassword = control.get('newPassword');
    const confirmPassword = control.get('confirmPassword');
    return newPassword?.value !== confirmPassword?.value ? { passwordMismatch: true } : null;
  }

  onSubmit(): void {
    if (this.resetForm.invalid) {
      return;
    }

    const code = this.resetForm.get('code')?.value;
    const newPassword = this.resetForm.get('newPassword')?.value;

    this.authService.resetPassword(this.userEmail, code, newPassword).subscribe({
      next: () => {
        alert('Password reset successfully! Please log in.');
        this.router.navigate(['/login']);
      },
      error: (err) => {
        this.errorMessage = 'Invalid or expired code. Please try again.';
      }
    });
  }
}
