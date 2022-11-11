import { Component, OnInit } from '@angular/core';
import { PeliculasService } from '../../services/peliculas.service';
import { Movie } from '../../interfaces/cartelera-response';

@Component({
  selector: 'app-peliculas',
  templateUrl: './peliculas.component.html',
  styleUrls: ['./peliculas.component.css']
})
export class PeliculasComponent implements OnInit {

   public peliculas: Movie[]=[];
  constructor(private PeliculasService : PeliculasService) { }

  ngOnInit(): void {
    this.PeliculasService.getCartelera()
    .subscribe( resp => {
      console.log('resp= ', resp);
      this.peliculas = resp;
      
    })
  }

}
