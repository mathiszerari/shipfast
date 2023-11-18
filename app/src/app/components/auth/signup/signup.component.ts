import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthCreateUser } from 'src/app/models/create-user.model';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styles: [
  ]
})

export class SignupComponent {
  signupForm: FormGroup;
  error: boolean = false;
  formErrors: any = {};

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/)
      ]]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const formData: AuthCreateUser = this.signupForm.value;
      this.authService.createUser(formData).subscribe((data) => {
        this.error = false;
        localStorage.clear();
        localStorage.setItem('name', data.name);
        localStorage.setItem('username', data.username);
        localStorage.setItem('email', data.email);
        localStorage.setItem('token', data.access_token);
        this.navigateToProfile(data.username);
      });
    } else {
      this.error = true;
    }
  }

  navigateToProfile(username: string): void {
    window.location.href = username;
  }

  openLogin() {
    window.location.href = '/auth/login';
  }

  openGithubLogin() {
    const url = 'http://127.0.0.1:8000/api/github-login'
    window.location.href = url;
  }
}