import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { AuthenticationService } from '../services/token.service';

@Injectable({
  providedIn: 'root',
})
export class ProfileGuard implements CanActivate {

  constructor(private authService: AuthenticationService, private router: Router) {}

  canActivate(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): boolean {
    if (this.authService.isAuthenticated()) {
      const usernameFromLocalStorage = localStorage.getItem('username');
      const usernameFromUrl = route.paramMap.get('username');

      if (usernameFromLocalStorage && usernameFromUrl && usernameFromLocalStorage === usernameFromUrl) {
        return true;
      } else {
        this.router.navigate(['/home']);
        return false;
      }
    } else {
      this.router.navigate(['/auth/login']);
      return false;
    }
  }
}