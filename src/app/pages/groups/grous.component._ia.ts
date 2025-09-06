import { GroupService } from '../../services/group.service';
import { Component } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
// import { GroupService } from './group.service';

@Component({
  selector: 'app-new-group',
  templateUrl: './new-group.component.html'
})
export class NewGroupComponent {
  groupForm: FormGroup;

  constructor(private fb: FormBuilder, private groupService: GroupService) {
    this.groupForm = this.fb.group({
      user_id: [''],
      user_admin: [''],
      name: [''],
      description: [''],
      active: [true],
      privacy: ['privado'],
      start_date: [''],
      end_date: ['']
    });
  }

  onSubmit() {
    if (this.groupForm.valid) {
      this.groupService.newGroup(this.groupForm.value).subscribe(
        response => {
          console.log('Grupo creado con éxito:', response);
        },
        error => {
          console.error('Error al crear el grupo:', error);
        }
      );
    }
  }
}
