import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';
import { GoogleUser } from 'src/app/models/google-user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGoogleService {
  constructor(private http: HttpClient) { }

  saveGoogleUser(user: GoogleUser): Observable<any> {
    const url = `${environment.apiUrl}/api/google-save-user`;
    return this.http.post<GoogleUser>(url, user);
  }

  googleLogin(): Observable<any> {
    const url = `${environment.apiUrl}/api/google-login`;
    return this.http.get<any>(url, { observe: 'response', responseType: 'json' as 'json' });
  }

  googleCallback(code: string): Observable<any> {
    const url = `${environment.apiUrl}/api/google-portal?code=${code}`;
    return this.http.get<any>(url);
  }
}