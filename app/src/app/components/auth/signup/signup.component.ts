import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthCreateUser } from 'src/app/models/create-user.model';
import { ApiService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styles: [
  ]
})
export class SignupComponent {
  signupForm: FormGroup;
  error: boolean = false;
  formErrors: any = {}; // Object to store form errors

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService,
    private router: Router
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/)]]
    });

    // Subscribe to form value changes to update errors dynamically
    this.signupForm.valueChanges.subscribe(data => {
      this.onValueChanged(data);
    });
  }

  onValueChanged(data?: any) {
    if (!this.signupForm) {
      return;
    }
    const form = this.signupForm;

    for (const field in this.formErrors) {
      // Clear previous error message (if any)
      this.formErrors[field] = '';
      const control = form.get(field);

      if (control && control.dirty && !control.valid) {
        const messages = this.validationMessages[field];
        for (const key in control.errors) {
          this.formErrors[field] += messages[key] + ' ';
        }
      }
    }
  }

  validationMessages: any = {
    'name': {
      'required': 'Name is required.'
    },
    'username': {
      'required': 'Username is required.'
    },
    'email': {
      'required': 'Email is required.',
      'email': 'Enter a valid email address.'
    },
    'password': {
      'required': 'Password is required.',
      'minlength': 'Password must be at least 8 characters long.',
      'pattern': 'Password must contain at least one letter and one number.'
    }
  };

  onSubmit() {
    if (this.signupForm.valid) {
      const formData: AuthCreateUser = this.signupForm.value;
      console.log(formData);
      this.apiService.createUser(formData).subscribe(
        (data) => {
          this.error = false;
          console.log(data);
          localStorage.clear();
          localStorage.setItem('name', data.name);
          localStorage.setItem('username', data.username);
          localStorage.setItem('email', data.email);
          localStorage.setItem('token', data.access_token);
          console.log(localStorage.getItem('name'));
          console.log(localStorage.getItem('token'));
          this.navigateToProfile(data.username);
        }
      );
    } else {
      console.log('the form is not valid');
      this.error = true;
    }
  }

  navigateToProfile(username: string): void {
    window.location.href = username;
  }

  pathLogin() {
    window.location.href = '/auth/login';
  }
}