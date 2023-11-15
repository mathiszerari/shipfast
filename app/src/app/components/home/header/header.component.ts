import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {
  users: any
  name: string = ""
  pp: string = "https://api.dicebear.com/7.x/thumbs/svg?seed="
  connected: boolean = false;


  constructor(
    private apiService: ApiService) { }

  ngOnInit(): void {
    this.apiService.getUsers().subscribe(
      (data: any) => {
        this.users = data;
        console.log(this.users);
      },
      (error) => {
        console.error('Error fetching users:', error);
      }
    );
  
    const storedName = localStorage.getItem('name');
    console.log(storedName);
    
    if (storedName !== null) {
      this.connected = true;
      this.name = storedName;
      console.log(this.connected);
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
    window.location.href = '/auth/login';
  }
}