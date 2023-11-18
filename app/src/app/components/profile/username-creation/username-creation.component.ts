import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GithubUser } from 'src/app/models/github-user.model';
import { AuthGithubService } from 'src/app/services/auth-github.service';

@Component({
  selector: 'app-username-creation',
  templateUrl: './username-creation.component.html',
  styles: [
  ]
})
export class UsernameCreationComponent {
  createUsernameForm: FormGroup;
  username: string = ""
  error!: string
  warning!: string
  connected: boolean = false;

  constructor(
    private formBuilder: FormBuilder,
    private authGithub: AuthGithubService,
    private route: ActivatedRoute,
  ) {
    this.createUsernameForm = this.formBuilder.group({
      username: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('catch_him') == 'true') {
      this.warning = "You need to complete this step before continuing your navigation 🔒"
    }

    if (localStorage.getItem('username')) {
      window.location.href = localStorage.getItem('username')!;
    }
  }

  onSubmit() {
    this.username = this.createUsernameForm.value.username
    const access_token = localStorage.getItem('token');

    if (access_token) {
      console.log("token");

      if (localStorage.getItem('access_token')) {
        this.authGithub.githubUser(access_token!).subscribe((data: any) => {
          console.log(data);

          this.localUser(data)
          this.connected = true;

          const userData: GithubUser = {
            id: data.id,
            username: this.createUsernameForm.value.username,
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
              console.log(data);
              localStorage.setItem('catch_him', '')
              localStorage.setItem('is_typing_username', '')
              window.location.href = this.username
            },
            (error: any) => {
              console.error(error);
              // Ici, vous pouvez accéder à l'erreur détaillée
              const errorMessage = error.error?.detail || 'An error occurred';
              // Traitez l'erreur comme vous le souhaitez (affichage à l'utilisateur, etc.)
              this.error = errorMessage;
            }
          )
        })
      }
    }
  }

  localUser(data: any) {
    localStorage.setItem('username', this.createUsernameForm.value.username);
    localStorage.setItem('github_username', data.login);
    localStorage.setItem('name', data.name);
    localStorage.setItem('email', data.email);
    localStorage.setItem('come_from', 'github');
    localStorage.setItem('location', data.location);
    localStorage.setItem('blog', 'blog');
    localStorage.setItem('twitter_username', data.twitter_username);
    console.log(localStorage); 
  }
}