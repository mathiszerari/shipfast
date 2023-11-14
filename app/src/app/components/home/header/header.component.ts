import { Component } from '@angular/core';
import { ApiService } from 'src/app/services/api.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})
export class HeaderComponent {
  users: any;

  constructor(private apiService: ApiService) { }

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
  }

  pathLogin() {
    window.location.href = '/auth/login';
  }

  pathHome() {
    window.location.href = '/home';
  }
}