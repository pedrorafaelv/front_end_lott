import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LoteriaService } from '../../services/loteria.service';
import { Carton } from '../../models/carton.model';
import { CarruselCartonesComponent } from '../carrusel-cartones/carrusel-cartones.component';
import { CartonSeleccionadoComponent } from '../carton-seleccionado/carton-seleccionado.component';

@Component({
  selector: 'app-seleccion-cartones',
  standalone: true,
  imports: [CommonModule, CarruselCartonesComponent, CartonSeleccionadoComponent],
  templateUrl: './seleccion-cartones.component.html',
  styleUrls: ['./seleccion-cartones.component.css']
})
export class SeleccionCartonesComponent implements OnInit {
  cartones: Carton[] = [];
  seleccionados: number[] = [];
  jugadorId: string = '';

  constructor(private loteriaService: LoteriaService) {}

  ngOnInit(): void {
    this.loteriaService.cartones$.subscribe(cartones => {
      this.cartones = cartones;
    });

    this.loteriaService.seleccionados$.subscribe(seleccionados => {
      this.seleccionados = seleccionados;
    });

    this.jugadorId = this.loteriaService.getJugadorActual().id;
  }

  onSeleccionarCarton(id: number): void {
    const exito = this.loteriaService.toggleCarton(id);
    if (!exito) {
      const carton = this.cartones.find(c => c.id === id);
      if (carton && !carton.disponible && !this.seleccionados.includes(id)) {
        alert(`El ${carton.nombre} ya fue seleccionado por otro jugador.`);
      } else if (this.seleccionados.length >= 6) {
        alert('Ya has seleccionado 6 cartones. No puedes agregar más.');
      }
    }
  }

  onEliminarSeleccionado(id: number): void {
    this.loteriaService.eliminarSeleccionado(id);
  }

  getCartonById(id: number): Carton {
    return this.cartones.find(c => c.id === id)!;
  }

  simularOtroJugador(): void {
    const disponibles = this.cartones.filter(c => c.disponible);
    if (disponibles.length > 0) {
      const randomIndex = Math.floor(Math.random() * disponibles.length);
      const carton = disponibles[randomIndex];
      this.loteriaService.simularSeleccionOtroJugador(carton.id);
    }
  }
}