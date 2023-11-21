import { Component } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { MenuBurgerService } from 'src/app/services/menu-burger.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styles: [
  ]
})
  
export class HomeComponent {
  isMobileMenuOpen: boolean = false;
  private menuSubscription: Subscription;

  constructor(private menuService: MenuBurgerService) {
    this.menuSubscription = this.menuService.isMobileMenuOpen$.subscribe((isOpen) => {
      this.isMobileMenuOpen = isOpen;
    });
  }

  ngOnDestroy() {
    this.menuSubscription.unsubscribe();
  }
  
}