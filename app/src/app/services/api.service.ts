import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ApiService {
  // L'URL de votre backend FastAPI
  private apiUrl = 'http://127.0.0.1:8000';  // Mettez votre propre URL

  constructor(private http: HttpClient) { }

  // Fonction pour récupérer les utilisateurs depuis le backend
  getUsers() {
    const url = `${this.apiUrl}/api/getusers`;
    return this.http.get(url);
  }
}