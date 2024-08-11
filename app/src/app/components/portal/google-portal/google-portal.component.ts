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

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const code = params['code'];
      if (code) {
        this.authGoogle.googleCallback(code).subscribe(data => {
          // Gérer la réponse et rediriger l'utilisateur vers la page d'accueil ou une autre page.
          console.log('User info:', data);
          // Par exemple, rediriger vers la page d'accueil après connexion.
          this.router.navigate(['/home']);
        });
      }
    });
  }

}
