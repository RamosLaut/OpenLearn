import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { Auth} from '../../services/auth';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.css'] 
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  isSubmitting = false;
  successMessage = '';
  errorMessage = '';

  constructor(private fb: FormBuilder, private authService: Auth) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]]
    });
  }

  onSubmit(): void {
    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.isSubmitting = true;
    this.successMessage = '';
    this.errorMessage = '';
    const email = this.forgotPasswordForm.get('email')?.value;

    // // ❗️ Lógica de Servicio (ver Paso 4)
    // // Necesitarás un método en tu servicio que llame al backend
    // this.authService.sendPasswordResetCode(email).subscribe({
    //   next: (response) => {
    //     this.successMessage = 'A reset code has been sent to your email.';
    //     this.isSubmitting = false;
    //     // Opcional: Redirigir a la página de "Ingresar Código"
    //     // this.router.navigate(['/enter-code']); 
    //   },
    //   error: (err) => {
    //     // No le digas al usuario si el email "no existe" (es un riesgo de seguridad)
    //     // Solo di que hubo un error o que "si el email existe, se envió"
    //     this.errorMessage = 'An error occurred. Please try again later.';
    //     this.isSubmitting = false;
    //   }
    // });
  }
}