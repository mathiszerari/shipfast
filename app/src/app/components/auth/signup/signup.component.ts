import { Component } from '@angular/core';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styles: [
  ]
})
export class SignupComponent {
  pathLogin() {
    window.location.href = '/auth/login';
  }

}