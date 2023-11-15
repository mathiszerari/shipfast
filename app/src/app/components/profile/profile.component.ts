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
    const usernameParam = this.route.snapshot.paramMap.get('username');
  
    if (usernameParam) {
      this.username = usernameParam;
    }
  }

  logout() {
    localStorage.clear();
    window.location.href = '/auth/login';
  }
}