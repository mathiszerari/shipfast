import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { GithubUser } from 'src/app/models/github-user.model';
import { AuthGithubService } from 'src/app/services/auth/auth-github.service';
import { AuthGoogleService } from 'src/app/services/auth/auth-google.service';

@Component({
  selector: 'app-username-creation',
  templateUrl: './username-creation.component.html',
  styles: [
  ]
})
export class UsernameCreationComponent {
  createUsernameForm: FormGroup
  username: string = ""
  error!: string
  warning!: string
  connected: boolean = false
  loader: boolean = false
  failure!: string

  constructor(
    private formBuilder: FormBuilder,
    private authGithub: AuthGithubService,
    private authGoogle: AuthGoogleService
  ) {
    this.createUsernameForm = this.formBuilder.group({
      username: ['', [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
    });
  }

  ngOnInit(): void {
    setTimeout(() => {
      if (localStorage.getItem('username')) {
        window.location.reload()
      }
    }, 500)

    if (localStorage.getItem('warning') == 'true') {
      this.warning = "You need to complete this step before continuing your navigation 🔒"
    }

    if (localStorage.getItem('username')) {
      window.location.href = localStorage.getItem('username')!;
    }
  }

  onSubmit() {
    this.loader = true
    const username = this.createUsernameForm.value.username;
    this.authGithub.checkUsernameAvailability(username).subscribe((data: any) => {
      if (data.message == "Username is already taken") {
        this.error = data.message
        this.loader = false
      } else if (data.message == "Username is available") {
        this.proceedWithUsernameCreation(username);
      }
    })
  }

  proceedWithUsernameCreation(username: string) {
    this.username = username
    const access_token = localStorage.getItem('token');
    const origin = localStorage.getItem('come_from');

    if (access_token) {
      if (origin == 'github') {
        this.githubProceed(access_token)
       }

      if (origin == 'google') { 
        this.googleProceed(access_token)
      }
    } else {
      this.failure = "An error occurred";
      this.loader = false
    }
  }

  githubProceed(access_token: string) {
    this.authGithub.githubToken(access_token!).subscribe((data: any) => {

      this.localUser(data)
      this.connected = true;

      const userData: GithubUser = {
        username: this.createUsernameForm.value.username.toLowerCase(),
        github_username: data.login,
        name: data.name || '',
        email: data.email || '',
        come_from: 'github',
        location: data.location || '',
        blog: data.blog || '',
        twitter_username: data.twitter_username || '',
      };

      this.authGithub.saveGithubUser(userData).subscribe(
        (data: any) => {
          localStorage.setItem('catch_him', 'false');
          localStorage.setItem('warning', 'false');
          window.location.href = this.username
        },
        (error: any) => {
          console.error(error);
          const errorMessage = error.error?.detail || 'An error occurred';
          this.error = errorMessage;
        }
      )
    })
  }

  googleProceed(access_token: string) {
    this.authGoogle.googleToken(access_token!).subscribe((data: any) => {
  
      this.localUser(data.user); // Enregistre les informations de l'utilisateur dans le localStorage
      this.connected = true;
  
      const userData: GithubUser = {
        username: this.createUsernameForm.value.username.toLowerCase(),
        github_username: data.user.github_username, // ou un autre identifiant pertinent
        name: data.user.name || '',
        email: data.user.email || '',
        come_from: 'google',
        location: data.user.location || '',
        blog: data.user.blog || '',
        twitter_username: data.user.twitter_username || '',
      };

      console.log(data);
    }, (error: any) => {
      console.error(error);
      this.failure = "Failed to retrieve user data from Google.";
      this.loader = false;
    });
  }
  

  localUser(data: any) {
    localStorage.setItem('username', this.createUsernameForm.value.username.toLowerCase());
    if (data.login) localStorage.setItem('github_username', data.login);
    localStorage.setItem('name', data.name);
    localStorage.setItem('email', data.email);
    localStorage.setItem('come_from', 'github');
    localStorage.setItem('location', data.location);
    localStorage.setItem('twitter_username', data.twitter_username);
  }
}