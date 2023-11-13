import { Component } from '@angular/core';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {
  pathLogin() {
    window.location.href = '/auth/login';
  }

  pathHome() {
    window.location.href = '/home';
  }
}