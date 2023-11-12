import { Component } from '@angular/core';

@Component({
  selector: 'app-home',
  template: `
    <div class="home">
      <app-header></app-header>
    </div>
  `,
  styles: [`
    .home {
      padding: 0 30rem;
    }`]
})
export class HomeComponent {
  
}