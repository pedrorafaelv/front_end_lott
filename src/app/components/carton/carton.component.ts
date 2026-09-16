import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
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
    @Input() recordGroup: string = '@';
    @Input() clickable: boolean = true;  // ← Nuevo: controla si es clickeable

    @Output() cartonClick = new EventEmitter<Card>();  // ← Emite el cartón clickea

    constructor() { }

    ngOnInit(): void {
        // console.log('carton = ', this.carton )
    }
     onCartonClick(): void {
        if (this.clickable) {
            this.cartonClick.emit(this.carton);
        }
    }
}