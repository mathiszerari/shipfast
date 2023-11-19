import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from 'src/app/services/auth.service';
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
    private authService: AuthService,
  ) {
    this.loginForm = this.formBuilder.group({
      username_or_email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      this.authService.loginUser(formData).subscribe((data: AuthReceiveLoginUser) => {
        localStorage.clear();
        this.username_or_email = data.username_or_email;
        localStorage.setItem('username_or_email', data.username_or_email);
        localStorage.setItem('token', data.access_token);
        this.getUserInfo();
        this.navigateToProfile();
      });
    } 
  }

  getUserInfo() {
    this.authService.getUserInfo(this.username_or_email).subscribe(
      (data: any) => {
        this.localUser(this);
      },
      (error) => {
        console.error('Error fetching user:', error);
      }
    );
  }

  openSignup() {
    window.location.href = '/auth/signup';
  }

  navigateToProfile(): void {
    setTimeout(() => {
      window.location.href = this.username;
    }, 100);
  }

  openLogin() {
    const url = 'http://127.0.0.1:8000/api/github-login'
    window.location.href = url;
  }

  localUser(data: any) {
    localStorage.setItem('name', this.name);
    localStorage.setItem('username', this.username);
    localStorage.setItem('email', this.email);
    this.name = data.name;
    this.username = data.username;
    this.email = data.email;
  }
}