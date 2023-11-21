import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BehaviorSubject, Subscription } from 'rxjs';
import { GithubUser } from 'src/app/models/github-user.model';
import { AuthGithubService } from 'src/app/services/auth-github.service';
import { AuthService } from 'src/app/services/auth.service';
import { MenuBurgerService } from 'src/app/services/menu-burger.service';

@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  styles: [
  ]
})

export class HeaderComponent {
  user: any
  username_or_email: string = localStorage.getItem('username') || '';
  name: string = localStorage.getItem('name') || '';
  username: string = localStorage.getItem('username') || '';
  email: string = localStorage.getItem('email') || '';
  pp: string = "https://api.dicebear.com/7.x/thumbs/svg?seed="
  connected: boolean = false;

  
  isMobileMenuOpen: boolean = false;
  private menuSubscription: Subscription;

  constructor(
    private authGithub: AuthGithubService,
    private route: ActivatedRoute,
    private menuService: MenuBurgerService
  ) { 

    this.menuSubscription = this.menuService.isMobileMenuOpen$.subscribe((isOpen) => {
      this.isMobileMenuOpen = isOpen;
    });
  }

  ngOnDestroy() {
    this.menuSubscription.unsubscribe();
  }

  navLinks = [
    { text: 'Store', path: '/store' },
    { text: 'Developer', path: '/developer' },
    { text: 'Teams', path: '/teams' },
    { text: 'Pro', path: '/pro' },
    { text: 'Changelog', path: '/changelog' },
    { text: 'Pricing', path: '/pricing' },
    { text: 'Blog', path: '/blog' },
  ];

  ngOnInit(): void {
    if (this.username != '') {
      this.connected = true;
    }

    if (localStorage.getItem('catch_him') == 'true' && window.location.pathname != '/username-creation') {
      localStorage.setItem('warning', 'true');
      window.location.href = '/username-creation';
    }
  }

  toggleMobileMenu() {
    this.menuService.toggleMobileMenu();
  }

  navigateToProfile(): void {
    window.location.href = this.username;
  }

  logout() {
    localStorage.clear();
    window.location.href = '/auth/login';
  }
}