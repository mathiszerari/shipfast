import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
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
    private apiService: ApiService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    if (this.username != '') {
      this.connected = true;
    }

    const access_token = localStorage.getItem('acces_token');
    if (access_token) {

      this.apiService.githubUser(access_token!).subscribe((data: any) => {
        console.log(data);
      })

    } else {

      this.route.queryParams.subscribe(params => {
        const code = params['code'];
        if (code ) {
          this.apiService.githubLogin(code).subscribe((data: any) => {
            localStorage.setItem('acces_token', data);
            console.log("done");
            
          });
        }
      });
    }

  }

  navigateToProfile(): void {
    window.location.href = this.username;
  }

  logout() {
    localStorage.clear();
    window.location.href = '/auth/login';
  }
}