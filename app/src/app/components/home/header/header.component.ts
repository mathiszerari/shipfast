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
  ) { }

  ngOnInit(): void {
    console.log('111111111111', '&&&&&&&&&&&&&&&&&&&&&&&&&');
    
    if (this.username != '') {
      this.connected = true;
    }

    if (!localStorage.getItem('token')) {
      this.route.queryParams.subscribe(params => {
        const code = params['code'];
        if (code) {
          this.authGithub.githubLogin(code).subscribe((data: any) => {
            localStorage.setItem('token', data);
            localStorage.setItem('access_token', data);
            console.log(data);
            console.log("done");

            this.authGithub.githubToken(data).subscribe((data: any) => {
              console.log(data);
              window.location.href = data.login;
            })
          });
        }
      });
    }
    this.authGithub.githubToken(localStorage.getItem('token')!).subscribe((data: any) => {
      console.log(data);
      this.authGithub.getGithubUserInfo(data.login).subscribe((updated_data: any) => {
        console.log(updated_data);
        localStorage.setItem('username', updated_data.username);
        
        this.username = updated_data.username;
        console.log(this.username);
      })
    })

    if (localStorage.getItem('access_token') && this.username == '' && !localStorage.getItem('is_typing_username')) {
      localStorage.setItem('is_typing_username', 'true')
      console.log('&&&&&&&&&&&&&&&&&&&');
      
      if (localStorage.getItem('username')) {
        localStorage.setItem('dont_pass', 'true')
      }
      
      setTimeout(() => {
        if (this.username == '' && !localStorage.getItem('dont_pass')) {
          window.location.href = '/username-creation';
        }
      }, 200);
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