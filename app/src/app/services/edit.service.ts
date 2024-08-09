import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { UpdateUser } from '../models/update-user.model';
import { HttpClient } from '@angular/common/http';
// en local
import { environment } from 'src/environments/environment.development';

// en prod
// import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class EditService {
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
    const url = `${environment.apiUrl}/api/update/${username}`;
    return this.http.put(url, editData);
  }
}
