import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs/internal/BehaviorSubject';

@Injectable({
  providedIn: 'root'
})
export class MenuBurgerService {
  private isMobileMenuOpenSource = new BehaviorSubject<boolean>(false);
  isMobileMenuOpen$ = this.isMobileMenuOpenSource.asObservable();

  constructor() { }

  toggleMobileMenu() {
    const currentValue = this.isMobileMenuOpenSource.value;
    this.isMobileMenuOpenSource.next(!currentValue);
  }
}
