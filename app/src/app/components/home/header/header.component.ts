import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { GithubUser } from 'src/app/models/github-user.model';
import { AuthGithubService } from 'src/app/services/auth-github.service';
import { AuthService } from 'src/app/services/auth.service';

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
    private authGithub: AuthGithubService,
    private route: ActivatedRoute,
  ) {}

  ngOnInit(): void {
    if (this.username != '') {
      this.connected = true;
    }

    const access_token = localStorage.getItem('token');

    if (access_token) {
      this.authGithub.githubUser(access_token!).subscribe((data: any) => {
        console.log(data);
        console.log(data.login);

        const userData: GithubUser = {
          id: data.id,
          login: data.login,
          name: data.name || '',
          email: data.email || '',
          location: data.location || '',
          come_from: 'github'
        };
        if (!localStorage.getItem('username')) {
          this.authGithub.saveGithubUser(userData).subscribe(
            (data: any) => {
              console.log(data);
            }
          )
        }
      })
    } else {
      // first connection
      this.route.queryParams.subscribe(params => {
        const code = params['code'];
        if (code ) {
          this.authGithub.githubLogin(code).subscribe((data: any) => {
            localStorage.setItem('token', data);
            console.log(data);
            console.log("done");
            
            this.authGithub.githubUser(data).subscribe((data: any) => {
              console.log(data);
              window.location.href = data.login;
            })
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