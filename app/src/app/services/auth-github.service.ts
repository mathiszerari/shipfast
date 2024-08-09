import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { GithubUser } from '../models/github-user.model';
import { environment } from 'src/environments/environment.development';

@Injectable({
  providedIn: 'root'
})
export class AuthGithubService {
  constructor(private http: HttpClient) { }

  githubLogin(code: string): Observable<any[]> {
    const url = `${environment.apiUrl}/api/github-token?code=${code}`;
    return this.http.get<any[]>(url);
  }

  githubToken(token: string): Observable<any[]> {
    const url = `${environment.apiUrl}/api/github-user?access_token=${token}`;
    return this.http.get<any[]>(url);
  }

  saveGithubUser(user: GithubUser): Observable<GithubUser> {
    const url = `${environment.apiUrl}/api/github-save-user`;
    return this.http.post<GithubUser>(url, user);
  }

  getGithubUserInfo(github_username: string): Observable<GithubUser> {
    const url = `${environment.apiUrl}/api/get_github_user_info`;
    return this.http.post<GithubUser>(url, { github_username: github_username });
  }
  
  checkUsernameAvailability(username: string): Observable<{ message: string }> {
    const url = `${environment.apiUrl}/api/check_username`;
    return this.http.get<{ message: string }>(url, { params: { username } });
  }
}