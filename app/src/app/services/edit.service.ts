import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UpdateUser } from '../models/update-user.model';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class EditService {
  private url = 'http://127.0.0.1:8000';
  private _edit = new BehaviorSubject<boolean>(false);
  edit$ = this._edit.asObservable();

  constructor(private http: HttpClient) { }

  get edit(): boolean {
    return this._edit.value;
  }

  set edit(value: boolean) {
    this._edit.next(value);
  }

  updateUser(editData: UpdateUser): Observable<any> {
    const username = localStorage.getItem('username') || '';
    const url = `${this.url}/api/update/${username}`;
    return this.http.put(url, editData);
  }
}
