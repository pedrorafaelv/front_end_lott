import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'imagen'
})
export class ImagenPipe implements PipeTransform {
public imagen2 : string; 
  transform(imagen: string, color: string): string {
     let img: string;
    if ( imagen ){
      if (imagen.indexOf('@')>0){
         color = 'full';
         img = imagen.substring(0, imagen.length - 1);
          // console.log('imagen =',img);
         return './assets/capicon/' + color + '/' + img;
      }else{
        if (color){
          return './assets/capicon/' + color + '/' + imagen;
        }                                         
        return './assets/capicon/black/'+imagen; 
      }       
    }
    return './assets/image/no-image.jpg';
       
  }

}
