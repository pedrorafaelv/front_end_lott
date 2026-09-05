import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'recordImage',
    standalone: false
})

export class RecordImagePipe implements PipeTransform {
  transform(imagen: string, nombreGrupo: string): string {
    let img: string;
    img=imagen;
    console.log('imagen =',img);
    console.log('nombreGrupo =',nombreGrupo);
    if ( imagen ){
      if (nombreGrupo && nombreGrupo.length>0){
        if (imagen.indexOf('@')>0){
          if (imagen.length>0){
            img = imagen.substring(0, imagen.length - 1);
          }
        }   
        return './assets/images/'+ nombreGrupo + '/' + img;
      }
        //  return './assets/images/full_' + nombreGrupo + '/' + img;
    }
      return './assets/images/no-image.jpg';
    }
  }

