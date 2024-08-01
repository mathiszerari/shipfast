import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthCreateUser } from '../models/create-user.model';
import { AuthReceiveLoginUser, AuthSendLoginUser } from '../models/login-user.model';
import { UserProfile } from '../models/user-info.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})

export class AuthService {
  constructor(private http: HttpClient) { }

  getUsers(): Observable<AuthCreateUser[]> {
    const url = `${environment.apiUrl}/api/getusers`;
    return this.http.get<AuthCreateUser[]>(url);
  }

  createUser(user: AuthCreateUser): Observable<AuthCreateUser> {
    const url = `${environment.apiUrl}/api/createusers`;
    return this.http.post<AuthCreateUser>(url, user);
  }

  loginUser(user: AuthSendLoginUser): Observable<AuthReceiveLoginUser> {
    const url = `${environment.apiUrl}/api/login`;
    return this.http.post<AuthReceiveLoginUser>(url, user);
  }

  getUserInfo(usernameOrEmail: string): Observable<UserProfile> {
    const url = `${environment.apiUrl}/api/get_user_info`;
    return this.http.post<UserProfile>(url, { username_or_email: usernameOrEmail });
  }
}