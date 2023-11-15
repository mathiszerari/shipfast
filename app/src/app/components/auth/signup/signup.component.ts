import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { createUser } from 'src/app/models/users';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styles: [
  ]
})
export class SignupComponent {
  signupForm: FormGroup;

  constructor(
    private fb: FormBuilder,
    private apiService: ApiService
  ) {
    this.signupForm = this.fb.group({
      name: ['', [Validators.required]],
      username: ['', [Validators.required]],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8), Validators.pattern(/^(?=.*[A-Za-z])(?=.*\d)[A-Za-z\d@$!%*#?&]{8,}$/)]]
    });
  }

  onSubmit() {
    if (this.signupForm.valid) {
      const formData: createUser = this.signupForm.value;
      console.log(formData);
      this.apiService.createUser(formData).subscribe(
        (data) => {
          console.log(data);
        }
      );
    } else {
      console.log('the formular is not valid');
    }
  }

  pathLogin() {
    window.location.href = '/auth/login';
  }
}