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
          });
        }
      });
      setTimeout(() => {
        this.authGithub.githubToken(localStorage.getItem('token')!).subscribe((data: any) => {
          console.log(data);
          this.authGithub.getGithubUserInfo(data.login).subscribe((updated_data: any) => {
            console.log(updated_data);

            if (!updated_data.username || updated_data.username == '') {
              localStorage.setItem('catch_him', 'true');
              console.log(localStorage);
              
              window.location.href = 'username-creation';
            } else {
              window.location.href = updated_data.username
            }

            localStorage.setItem('username', updated_data.username);
            
            this.username = updated_data.username;
            console.log(this.username);
          },
          (error) => {
            localStorage.setItem('catch_him', 'true');
            console.log(localStorage);
            window.location.href = 'username-creation';
          })
        })
      }, 500)
    }
  }

}
