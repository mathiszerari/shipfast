import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthCreateUser } from 'src/app/models/create-user.model';
import { AuthService } from 'src/app/services/auth.service';
import { environment } from 'src/environments/environment.development';

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
  texterror: string = "";

  constructor(
    private formBuilder: FormBuilder,
    private authService: AuthService,
  ) {
    this.signupForm = this.formBuilder.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        // Validators.minLength(8),
        // Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/)
      ]]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const formData: AuthCreateUser = this.signupForm.value;
      formData.username = formData.username.toLowerCase();
      this.authService.createUser(formData).subscribe((data) => {
        console.log(data);
        
        this.error = false
        localStorage.clear()
        this.localUser(data)
        this.navigateToProfile(data.username)
      } , (error) => {
        console.error(error);
        this.texterror = error.error.detail
        this.error = true
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
    const url = `${environment.apiUrl}/api/github-login`
    window.location.href = url;
  }

  localUser(data: any) {
    localStorage.setItem('name', data.name);
    localStorage.setItem('username', data.username.toLowerCase());
    localStorage.setItem('email', data.email);
    localStorage.setItem('token', data.access_token);
  }
}