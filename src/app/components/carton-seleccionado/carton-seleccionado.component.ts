import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Carton } from '../../models/carton.model';
import { card } from '../../interfaces/card-response';

@Component({
  selector: 'app-carton-seleccionado',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carton-seleccionado.component.html',
  styleUrls: ['./carton-seleccionado.component.css']
})
export class CartonSeleccionadoComponent {
  @Input() carton!: Carton;
  @Input() raffleId:number = 0;
  @Input() Cartones:card[]= [];
  @Output() eliminar = new EventEmitter<number>();

  // Método auxiliar para evitar el error de some() en el template
  tieneComodin(): boolean {
    return this.carton.grid.some(c => c.libre);
  }

  eliminarCarton(): void {
    this.eliminar.emit(this.carton.id);
  }
}