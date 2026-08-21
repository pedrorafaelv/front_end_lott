import { Component, OnInit } from '@angular/core';
import { PublicityComponent } from '../../components/publicity/publicity.component';

@Component({
    selector: 'app-profile',
    templateUrl: './profile.component.html',
    styleUrls: ['./profile.component.css'],
    standalone: true,
    imports:[PublicityComponent]

  })
export class ProfileComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
  }

}
