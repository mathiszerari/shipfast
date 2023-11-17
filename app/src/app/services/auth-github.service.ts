import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GithubUser, UsernameCreation } from '../models/github-user.model';

@Injectable({
  providedIn: 'root'
})
export class AuthGithubService {
  private apiUrl = 'http://127.0.0.1:8000';

  constructor(private http: HttpClient) { }

  githubLogin(code: string): Observable<any[]> {
    const url = `${this.apiUrl}/api/github-token?code=${code}`;
    return this.http.get<any[]>(url);
  }

  githubUser(token: string): Observable<any[]> {
    const url = `${this.apiUrl}/api/github-user?access_token=${token}`;
    return this.http.get<any[]>(url);
  }

  saveGithubUser(user: GithubUser): Observable<GithubUser> {
    const url = `${this.apiUrl}/api/github-save-user`;
    return this.http.post<GithubUser>(url, user);
  }

  shipfastUsername(data: UsernameCreation): Observable<UsernameCreation> {
    const url = `${this.apiUrl}/api/username-creation`;
    return this.http.post<UsernameCreation>(url, data);
  }
}