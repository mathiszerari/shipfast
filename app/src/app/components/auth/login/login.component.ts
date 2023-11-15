import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ApiService } from 'src/app/services/auth.service';
import { AuthReceiveLoginUser } from 'src/app/models/login-user.model';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})

export class LoginComponent {
  loginForm: FormGroup;
  username_or_email: string = ""
  name: string = ""
  username: string = ""
  email: string = ""

  constructor(
    private formBuilder: FormBuilder,
    private apiService: ApiService,
  ) {
    this.loginForm = this.formBuilder.group({
      usernameOrEmail: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      this.apiService.loginUser(formData).subscribe((data: AuthReceiveLoginUser) => {
        localStorage.clear();
        localStorage.setItem('username_or_email', data.username_or_email);
        this.username_or_email = data.username_or_email;
        localStorage.setItem('token', data.access_token);
        this.getUserInfo();
        this.navigateToProfile();
      });
    } else {
      console.log('The form is not valid');
    }
  }

  getUserInfo() {
    this.apiService.getUserInfo(this.username_or_email).subscribe(
      (data: any) => {
        this.name = data.name;
        this.username = data.username;
        this.email = data.email;
        localStorage.setItem('name', this.name);
        localStorage.setItem('username', this.username);
        localStorage.setItem('email', this.email);
      },
      (error) => {
        console.error('Error fetching user:', error);
      }
    );
  }

  pathSignup() {
    window.location.href = '/auth/signup';
  }

  navigateToProfile(): void {
    setTimeout(() => {
      window.location.href = this.username;
    }, 100);
  }
}