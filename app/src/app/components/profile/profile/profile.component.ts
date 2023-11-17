import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { AuthService } from 'src/app/services/auth.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent {
  name: string = localStorage.getItem('name') || "";
  username: string = localStorage.getItem('username') || "";
  email: string = localStorage.getItem('email') || "";
  come_from: string = localStorage.getItem('come_from') || "";
  location: string = localStorage.getItem('location') || "";
  blog: string = localStorage.getItem('blog') || "";
  twitter_username: string = localStorage.getItem('twitter_username') || "";
  arobase: string = "@"

  constructor(
    private route: ActivatedRoute,
    private authService: AuthService) { }

  ngOnInit(): void {
    if (localStorage.getItem('token') !== null && !localStorage.getItem('save_user')) {
      console.log(this.username);
      
      this.authService.getUserInfo(this.username).subscribe(
        (data: any) => {
          console.log(data);
          
          this.name = data.name;
          this.username = data.username;
          this.email = data.email;
          this.come_from = data.come_from;
          this.location = data.location;
          this.blog = data.blog;
          this.twitter_username = data.twitter_username;
          localStorage.setItem('name', this.name);
          localStorage.setItem('username', this.username);
          localStorage.setItem('email', this.email);
          localStorage.setItem('come_from', this.come_from);
          localStorage.setItem('location', this.location);
          localStorage.setItem('blog', this.blog);
          localStorage.setItem('twitter_username', this.twitter_username);
          console.log(data);
        },
        (error) => {
          console.error('Error fetching user:', error);
        }
      );
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
      window.location.href = httpurl + this.username;
      console.log("Redirection vers le username:", httpurl + this.username);
    }
  }

  openTwitter() {
    var httpurl = "https://twitter.com/";

    if (this.blog) {
      window.location.href = httpurl + this.username;
      console.log("Redirection vers le username:", httpurl + this.username);
    }
  }

  logout() {
    localStorage.clear();
    window.location.href = '/auth/login';
  }
}