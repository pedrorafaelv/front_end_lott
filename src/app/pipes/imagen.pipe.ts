import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {
public imagen2 : string; 
  transform(imagen: string, nombreGrupo: string): string {
     let img: string;
    if ( imagen ){
      if (imagen.indexOf('@')>0){
         img = imagen.substring(0, imagen.length - 1);
         // console.log('imagen =',img);
         return './assets/images/full_'+ nombreGrupo +'/' + img;
      }else{
          return './assets/images/black_'+ nombreGrupo +'/' + imagen;
      }
    }
    return './assets/images/no-image.jpg';
  }
}
