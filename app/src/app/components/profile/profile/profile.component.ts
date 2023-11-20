import { Component } from '@angular/core';
import { EditService } from 'src/app/services/edit.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styles: [
  ]
})
export class ProfileComponent {
  edit: boolean | undefined 

  constructor(private editService: EditService) {
    this.editService.edit$.subscribe((value) => {
      this.edit = value;
    });
   }
}