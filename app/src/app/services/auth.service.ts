import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { createUser, loginUser } from '../models/users';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<createUser[]> {
    const url = `${this.apiUrl}/api/getusers`;
    return this.http.get<createUser[]>(url);
  }

  createUser(user: createUser): Observable<createUser> {
    const url = `${this.apiUrl}/api/createusers`;
    return this.http.post<createUser>(url, user);
  }

  loginUser(user: any): Observable<any> {
    const url = `${this.apiUrl}/api/login`;
    return this.http.post<any>(url, user);
  }

  getUserInfo(usernameOrEmail: string): Observable<any> {
    const url = `${this.apiUrl}/api/get_user_info?username_or_email=${usernameOrEmail}`;
    return this.http.get<any>(url);
  }
}