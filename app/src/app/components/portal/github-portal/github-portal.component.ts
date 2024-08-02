import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthGithubService } from 'src/app/services/auth-github.service';

@Component({
  selector: 'app-github-portal',
  templateUrl: './github-portal.component.html',
  styles: [
  ]
})
export class GithubPortalComponent {
  username: string = localStorage.getItem('username') || '';

  constructor(
    private authGithub: AuthGithubService,
    private route: ActivatedRoute,
  ) { }

  ngOnInit(): void {
    localStorage.setItem('come_from', 'github');
    
    if (!localStorage.getItem('token')) {
      this.route.queryParams.subscribe(params => {
        const code = params['code'];
        if (code) {
          this.authGithub.githubLogin(code).subscribe((data: any) => {
            localStorage.setItem('token', data);
            localStorage.setItem('access_token', data);
            
            this.authGithub.githubToken(data).subscribe((tokenData: any) => {
              this.authGithub.getGithubUserInfo(tokenData.login).subscribe((userInfo: any) => {
                if (!userInfo.username || userInfo.username == '') {
                  localStorage.setItem('catch_him', 'true');
                  window.location.href = 'username-creation';
                } else {
                  window.location.href = userInfo.username;
                  localStorage.setItem('username', userInfo.username);
                  this.username = userInfo.username;
                }
              },
              (error) => {
                localStorage.setItem('catch_him', 'true');
                window.location.href = 'username-creation';
              });
            });
          });
        }
      });
    }
  }

}
