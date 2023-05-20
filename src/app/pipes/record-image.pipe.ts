import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'recordImage'
})
export class RecordImagePipe implements PipeTransform {
  transform(imagen: string, nombreGrupo: string): string {
    let img: string;
    if ( imagen ){
      if (imagen.indexOf('@')>0){
         img = imagen.substring(0, imagen.length - 1);
          console.log('imagen =',img);
         return './assets/images/full_circle_' + nombreGrupo + '/' + img;
      }else{
        return './assets/images/black_'+ nombreGrupo +'/'+imagen; 
      }
    }
    return './assets/images/no-image.jpg';
  }

}
