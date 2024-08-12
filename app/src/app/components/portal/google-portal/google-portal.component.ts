import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthGoogleService } from 'src/app/services/auth/auth-google.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-google-portal',
  templateUrl: './google-portal.component.html',
  styles: [
  ]
})
export class GooglePortalComponent {
  username: string = localStorage.getItem('username') || '';

  constructor(
    private authGoogle: AuthGoogleService,
    private route: ActivatedRoute,
    private router: Router
  ) { }

  onGoogleLogin() {
    this.authGoogle.googleLogin().subscribe(response => {
      // Ici, vous pouvez gérer la redirection vers l'URL de Google, si nécessaire.
      // Par exemple, redirigez l'utilisateur vers la page de connexion Google.
      window.location.href = response.url; // Redirection vers Google login
    });
  }

  ngOnInit(): void {
    localStorage.setItem('come_from', 'google');

    
    if (!localStorage.getItem('token')) {
      this.route.queryParams.subscribe(params => {
        const code = params['code'];
        console.log(code);
        
        if (code) {
          this.authGoogle.googleCallback(code).subscribe((data: any) => {
            console.log(data);

            if (!data.username || data.username == '') {
              localStorage.setItem('catch_him', 'true');
              window.location.href = 'username-creation';
            }
            
            // localStorage.setItem('token', data);
            // localStorage.setItem('access_token', data);
            
            // this.authGithub.githubToken(data).subscribe((tokenData: any) => {
            //   this.authGithub.getGithubUserInfo(tokenData.login).subscribe((userInfo: any) => {
            //     if (!userInfo.username || userInfo.username == '') {
            //       localStorage.setItem('catch_him', 'true');
            //       window.location.href = 'username-creation';
            //     } else {
            //       window.location.href = userInfo.username;
            //       localStorage.setItem('username', userInfo.username);
            //       this.username = userInfo.username;
            //     }
            //   },
            //   (error) => {
            //     localStorage.setItem('catch_him', 'true');
            //     window.location.href = 'username-creation';
            //   });
            // });
          });
        }
      });
    }
  }

}
