import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})

export class AuthenticationService {
  getToken(): string | null {
    return localStorage.getItem('token');
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}