import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EditService {
  private _edit = new BehaviorSubject<boolean>(false);
  edit$ = this._edit.asObservable();

  get edit(): boolean {
    return this._edit.value;
  }

  set edit(value: boolean) {
    this._edit.next(value);
  }

  constructor() { }
}
