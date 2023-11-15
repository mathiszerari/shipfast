import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { loginUser } from 'src/app/models/users';
import { ApiService } from 'src/app/services/auth.service';

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
    private apiService: ApiService
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
        (data) => {
          console.log(data);
          // Clear all items in the local storage
          localStorage.clear();
          localStorage.setItem('username_or_email', data.username_or_email);
          data.username_or_email = this.username_or_email
          localStorage.setItem('token', data.access_token);
          console.log(localStorage.getItem('username_or_email'));
          console.log(localStorage.getItem('token'));
          window.location.href = '/profile';
        }
      );
      this.username_or_email = localStorage.getItem('username_or_email') || '';
      
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
        },
        (error) => {
          console.error('Error fetching user:', error);
        }
      );
    } else {
      console.log('the form is not valid');
    }
  }

  pathSignup() {
    window.location.href = '/auth/signup';
  }
}