import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ApiService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent {
  username: string = '';
  name: string = ""
  email: string = ""

  constructor(
    private route: ActivatedRoute,
    private apiService: ApiService) { }

  ngOnInit(): void {
    const usernameParam = this.route.snapshot.paramMap.get('username');
  
    if (usernameParam) {
      this.username = usernameParam;
    }

    this.apiService.getUserInfo(this.username).subscribe(
      (data: any) => {
        this.name = data.name;
        this.username = data.username;
        this.email = data.email;
        localStorage.clear
        localStorage.setItem('name', this.name);
        localStorage.setItem('username', this.username);
        localStorage.setItem('email', this.email);
        console.log(data);
      },
      (error) => {
        console.error('Error fetching user:', error);
      }
    );
  }

  logout() {
    localStorage.clear();
    window.location.href = '/auth/login';
  }
}