import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent {
  username: string = '';

  constructor(private route: ActivatedRoute) { }

  ngOnInit(): void {
    const routeUsername = this.route.snapshot.paramMap.get('username');

    // Assurez-vous que la valeur n'est pas null avant de l'assigner
    if (routeUsername) {
      this.username = routeUsername;
      console.log(this.username);
    }
  }

  logout() {
    localStorage.clear();
    window.location.href = '/auth/login';
  }
}