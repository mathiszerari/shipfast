import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { loginUser } from 'src/app/models/users';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styles: [
  ]
})
export class LoginComponent {
  loginForm: FormGroup;

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
      const formData: loginUser = this.loginForm.value;
      console.log(formData);
      
      this.apiService.loginUser(formData).subscribe(
        (data) => {
          console.log(data);
          // Convertir l'objet en chaîne JSON
          const jsonData = JSON.stringify(data);
  
          // Stocker la chaîne JSON dans le Local Storage
          localStorage.setItem('token', jsonData);
          console.log(localStorage.getItem('token'));
          window.location.href = '/profile';
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