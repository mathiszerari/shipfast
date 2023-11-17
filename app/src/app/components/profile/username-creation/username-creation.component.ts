import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-username-creation',
  templateUrl: './username-creation.component.html',
  styles: [
  ]
})
export class UsernameCreationComponent {
  createUsernameForm: FormGroup;
  username: string = ""

  constructor(
    private formBuilder: FormBuilder,
  ) {
    this.createUsernameForm = this.formBuilder.group({
      username: ['', [Validators.required]],
    });
  }


  onSubmit() {
    if (this.createUsernameForm.valid) {
      this.username = this.createUsernameForm.value;
      console.log(this.username);
    }
  }
}