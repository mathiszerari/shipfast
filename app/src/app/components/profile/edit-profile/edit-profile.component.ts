import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
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
      name: [this.name],
      username: [this.username],
      email: [this.email],
      location: [this.location],
      website: [this.blog],
      twitter_username: [this.twitter_username],
      github_username: [this.github_username],
      about: [this.about],
    });
  }

  ngOnInit(): void {
    console.log(localStorage)
  }

  onSubmit() {
    console.log(this.editProfile.value);
  }

  editSession() {
    this.editService.edit = !this.editService.edit
  }
}
