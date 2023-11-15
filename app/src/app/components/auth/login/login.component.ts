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
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.loginForm = this.fb.group({
      username_or_email: ['', [Validators.required]],
      password: ['', [Validators.required]],
    });
  }

  onSubmit() {
    if (this.loginForm.valid) {
      const formData = this.loginForm.value;
      this.apiService.loginUser(formData).subscribe(
        (data: AuthReceiveLoginUser) => {
          console.log(data);
          localStorage.clear();
          localStorage.setItem('username_or_email', data.username_or_email);
          this.username_or_email = data.username_or_email
          localStorage.setItem('token', data.access_token);
          console.log(localStorage.getItem('username_or_email'));
          console.log(localStorage.getItem('token'));
          this.getUserInfo();
          this.navigateToProfile();
        }
      );
    } else {
      console.log('the form is not valid');
    }
  }

  pathSignup() {
    window.location.href = '/auth/signup';
  }

  navigateToProfile(): void {
    setTimeout(() => {
      window.location.href = this.username;
    }, 100);
  }

  getUserInfo() {
    this.apiService.getUserInfo(this.username_or_email).subscribe(
      (data: any) => {
        console.log(data);
        this.name = data.name
        localStorage.setItem('name', data.name);
        this.username = data.username
        localStorage.setItem('username', data.username);
        this.email = data.email
        localStorage.setItem('email', data.email);
        console.log(data);
        console.log('salut');
      },
      (error) => {
        console.error('Error fetching user:', error);
      }
    );
  }
}