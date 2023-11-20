import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { finalize } from 'rxjs';
import { EditService } from 'src/app/services/edit.service';

@Component({
  selector: 'app-edit-profile',
  templateUrl: './edit-profile.component.html',
  styles: [
  ]
})
export class EditProfileComponent {
  editProfile: FormGroup;

  name: string = localStorage.getItem('name') || "";
  username: string = localStorage.getItem('username') || "";
  email: string = localStorage.getItem('email') || "";
  location: string = localStorage.getItem('location') || "";
  blog: string = localStorage.getItem('blog') || "";
  twitter_username: string = localStorage.getItem('twitter_username') || "";
  github_username: string = localStorage.getItem('github_username') || "";
  about: string = localStorage.getItem('about') || "";
  creation_month: string = localStorage.getItem('creation_month') || "";
  creation_year: string = localStorage.getItem('creation_year') || "";
  come_from: string = localStorage.getItem('come_from') || "";

  constructor(
    private formBuilder: FormBuilder,
    private editService: EditService,) {
    this.editProfile = this.formBuilder.group({
      name: [this.name, [Validators.required]],
      username: [this.username, [Validators.required, Validators.pattern(/^[A-Za-z]+$/)]],
      email: [this.email, [Validators.required, Validators.email]],
      location: [this.location],
      blog: [this.blog],
      twitter_username: [this.twitter_username],
      github_username: [this.github_username],
      about: [this.about],
    });
  }

  onSubmit() {
    const editForm = this.editProfile.value
    editForm.username = editForm.username.toLowerCase()

    this.editService.updateUser(editForm).pipe(
      finalize(() => {
        window.location.href = editForm.username;
        const token = localStorage.getItem('token');
        if (localStorage.getItem('access_token')) {
          const access_token = localStorage.getItem('access_token');
          localStorage.clear();
          localStorage.setItem('access_token', access_token!);
        }
        localStorage.clear();
        localStorage.setItem('token', token!);
        localStorage.setItem('username', editForm.username);
      })
    ).subscribe(
      (response: any) => {
        console.log('User updated successfully:', response);
      },
      (error) => {
        console.error('Error updating user:', error);
      }
    );
  }

  editSession() {
    this.editService.edit = !this.editService.edit
  }
}
