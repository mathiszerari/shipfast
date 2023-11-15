import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {
  user: any
  username_or_email: string = localStorage.getItem('username') || '';
  name: string = localStorage.getItem('name') || '';
  username: string = localStorage.getItem('username') || '';
  email: string = localStorage.getItem('email') || '';
  pp: string = "https://api.dicebear.com/7.x/thumbs/svg?seed="
  connected: boolean = false;


  constructor(
    private apiService: ApiService) { }

  ngOnInit(): void {
    console.log(localStorage);
    console.log(this.username);
    
    
    if (this.username != '') {
      this.connected = true;
    }
  }

  pathLogin() {
    window.location.href = '/auth/login';
  }

  pathHome() {
    window.location.href = '/home';
  }

  pathProfile() {
    window.location.href = '/profile';
  }

  logout() {
    localStorage.clear();
    console.log(localStorage);
    
    window.location.href = '/auth/login';
  }
}