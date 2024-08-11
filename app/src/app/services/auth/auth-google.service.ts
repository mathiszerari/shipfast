import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthGoogleService {
  constructor(private http: HttpClient) { }

  googleLogin(): Observable<any> {
    const url = `${environment.apiUrl}/api/google-login`;
    return this.http.get<any>(url, { observe: 'response', responseType: 'json' as 'json' });
  }

  googleCallback(code: string): Observable<any> {
    const url = `${environment.apiUrl}/api/google-callback?code=${code}`;
    return this.http.get<any>(url);
  }
}