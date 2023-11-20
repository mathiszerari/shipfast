import { Component } from '@angular/core';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styles: [
  ]
})
export class EditProfileComponent {
  name: string = localStorage.getItem('name') || "";
  username: string = localStorage.getItem('username') || "";
  email: string = localStorage.getItem('email') || "";
  come_from: string = localStorage.getItem('come_from') || "";
  location: string = localStorage.getItem('location') || "";
  blog: string = localStorage.getItem('blog') || "";
  github_username: string = localStorage.getItem('github_username') || "";
  twitter_username: string = localStorage.getItem('twitter_username') || "";
  creation_month: string = localStorage.getItem('creation_month') || "";
  creation_year: string = localStorage.getItem('creation_year') || "";

  ngOnInit(): void {
    console.log(localStorage)
  }

}
