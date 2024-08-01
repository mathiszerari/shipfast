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
            console.log(data);
            
            localStorage.setItem('token', data);
            localStorage.setItem('access_token', data);
            
            this.authGithub.githubToken(data).subscribe((tokenData: any) => {
              console.log(tokenData);
              
              this.authGithub.getGithubUserInfo(tokenData.login).subscribe((userInfo: any) => {
                console.log(userInfo);
                console.log("on a trouvé son compte");
                
                if (!userInfo.username || userInfo.username == '') {
                  localStorage.setItem('catch_him', 'true');
                  console.log(localStorage);
                  window.location.href = 'username-creation';
                } else {
                  window.location.href = userInfo.username;
                  localStorage.setItem('username', userInfo.username);
                  this.username = userInfo.username;
                  console.log(this.username);
                }
              },
              (error) => {
                console.log("on l'a pas en base");
                localStorage.setItem('catch_him', 'true');
                console.log(localStorage);
                window.location.href = 'username-creation';
              });
            });
          });
        }
      });
    }
  }

}
