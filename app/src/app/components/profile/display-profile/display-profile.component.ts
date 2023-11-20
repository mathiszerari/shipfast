import { Component } from '@angular/core';
import { AuthGithubService } from 'src/app/services/auth-github.service';
import { AuthService } from 'src/app/services/auth.service';
import { EditService } from 'src/app/services/edit.service';

@Component({
  selector: 'app-display-profile',
  templateUrl: './display-profile.component.html',
  styles: [
  ]
})
export class DisplayProfileComponent {
  edit: boolean | undefined
  name: string = localStorage.getItem('name') || "";
  username: string = localStorage.getItem('username') || "";
  email: string = localStorage.getItem('email') || "";
  come_from: string = localStorage.getItem('come_from') || "";
  location: string = localStorage.getItem('location') || "";
  blog: string = localStorage.getItem('blog') || "";
  github_username: string = localStorage.getItem('github_username') || "";
  twitter_username: string = localStorage.getItem('twitter_username') || "";
  about: string = localStorage.getItem('about') || "";
  creation_month: string = localStorage.getItem('creation_month') || "";
  creation_year: string = localStorage.getItem('creation_year') || "";
  arobase: string = "@"

  constructor(
    private authService: AuthService,
    private authGithub: AuthGithubService,
    private editService: EditService) {
      this.editService.edit$.subscribe((value) => {
        this.edit = value;
      });
    }

  ngOnInit(): void {
    if ((localStorage.getItem('token') !== null && !localStorage.getItem('save_user')) || localStorage.getItem('username_craft') != '') {
      console.log(this.username);

      if (this.username != '') {
        this.authService.getUserInfo(this.username).subscribe(
          (data: any) => {
            console.log(data);
            this.setVariables(data);
            this.localUser(this);
            console.log(data);
          },
          (error) => {
            console.error('Error fetching user:', error);
          }
        );
      } else {
        if (localStorage.getItem('access_token')) {
          this.authGithub.githubToken(localStorage.getItem('token')!).subscribe((data: any) => {
            console.log(data);

            this.authGithub.getGithubUserInfo(data.login).subscribe((updated_data: any) => {
              console.log(updated_data);
              this.localUser(updated_data)
              window.location.reload();
            })
          })
        }
      }
    }
  }

  openBlog() {
    var httpurl = "https://";
    if (this.blog) {
      window.location.href = httpurl + this.blog;
      console.log("Redirection vers le blog:", httpurl + this.blog);
    }
  }

  openGithub() {
    var httpurl = "https://github.com/";
    if (this.blog) {
      window.location.href = httpurl + this.github_username;
      console.log("Redirection vers le github_username:", httpurl + this.github_username);
    }
  }

  openTwitter() {
    var httpurl = "https://twitter.com/";
    if (this.blog) {
      window.location.href = httpurl + this.twitter_username;
      console.log("Redirection vers le twitter_username:", httpurl + this.twitter_username);
    }
  }

  logout() {
    localStorage.clear();
    window.location.href = '/auth/login';
  }

  editSession() {
    console.log(this.editService.edit);
    this.editService.edit = !this.editService.edit
  }

  localUser(data: any) {
    localStorage.setItem('username', data.username);
    localStorage.setItem('name', data.name);
    localStorage.setItem('email', data.email);
    localStorage.setItem('come_from', 'github');
    localStorage.setItem('location', data.location);
    localStorage.setItem('blog', data.blog);
    localStorage.setItem('twitter_username', data.twitter_username);
    localStorage.setItem('github_username', data.github_username);
    localStorage.setItem('about', data.about);
    localStorage.setItem('creation_month', 'creation_month');
    localStorage.setItem('creation_year', data.creation_year);
    console.log(localStorage);
  }

  setVariables(data: any) {
    this.name = data.name;
    this.username = data.username;
    this.email = data.email;
    this.come_from = data.come_from;
    this.location = data.location;
    this.blog = data.blog;
    this.twitter_username = data.twitter_username;
    this.github_username = data.github_username;
    this.about = data.about;
    this.creation_month = data.creation_month;
    this.creation_year = data.creation_year;
  }
}