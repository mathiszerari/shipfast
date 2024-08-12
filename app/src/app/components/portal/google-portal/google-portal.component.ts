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
        
        if (code) {
          this.authGoogle.googleCallback(code).subscribe((data: any) => {
            localStorage.setItem('token', data.access_token);
            localStorage.setItem('access_token', data.access_token);

            if (!data.user.username || data.user.username == '') {
              localStorage.setItem('catch_him', 'true');
              
              localStorage.setItem('name', data.user.name);
              localStorage.setItem('email', data.user.email);
              localStorage.setItem('come_from', 'google');
              localStorage.setItem('verified_email', data.user.verified_email);
              localStorage.setItem('creation_month', data.user.creation_month);
              localStorage.setItem('creation_year', data.user.creation_year);


              window.location.href = 'username-creation';
            } else {
              window.location.href = data.user.username;
              localStorage.setItem('username', data.user.username);
              this.username = data.user.username;
            }
          });
        }
      });
    }
  }

}
