import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { User } from '../models/users';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  private apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) { }

  getUsers(): Observable<User[]> {
    const url = `${this.apiUrl}/api/getusers`;
    return this.http.get<User[]>(url);
  }

  createUser(user: User): Observable<User> {
    const url = `${this.apiUrl}/api/creatusers`;
    return this.http.post<User>(url, user);
  }
}