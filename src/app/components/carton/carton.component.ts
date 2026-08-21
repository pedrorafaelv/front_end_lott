import { Component, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { PipesModule } from '../../pipes/pipes.module';
import { DirectivesModule } from '../../directives/directives.module';
import { Card } from '../../interfaces/get-cards-raffle-response';

@Component({
    selector: 'app-carton',
    standalone: true,  // <-- Hacer standalone
    imports: [
        CommonModule,
        PipesModule,
        DirectivesModule
    ],
    templateUrl: './carton.component.html',
    styleUrls: ['./carton.component.css']
})
export class CartonComponent implements OnInit {
    @Input() carton!: Card;
    @Input() recordGroup: string = 'primer';

    constructor() { }

    ngOnInit(): void {
    }
}