import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { UsernameCreation } from 'src/app/models/github-user.model';
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

  constructor(
    private formBuilder: FormBuilder,
    private authGithub: AuthGithubService,
  ) {
    this.createUsernameForm = this.formBuilder.group({
      username: ['', [Validators.required]],
    });
  }

  ngOnInit(): void {
    if (localStorage.getItem('catch_him') == 'true') {
      this.warning = "You need to complete this step before continuing your navigation 🔒"
    }
  }

  onSubmit() {
    const data: UsernameCreation = {
      github_username: localStorage.getItem('github_username') || '',
      username: this.createUsernameForm.get('username')?.value || '',
    };

    this.username = this.createUsernameForm.get('username')?.value
    localStorage.setItem('username', this.username);
    localStorage.setItem('username_crafted', 'true');
    console.log(this.username);

    this.authGithub.shipfastUsername(data).subscribe(
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
  }
}