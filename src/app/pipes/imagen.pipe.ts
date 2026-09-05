import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
    name: 'imagen',
    standalone: false
})
export class ImagenPipe implements PipeTransform {
  public imagen2: string = '';

  transform(imagen: string, nombreGrupo: string): string {
    let img: string;
    // console.log('dentro del pipe imagen ', 'imagen =', imagen, 'nombreGrupo =', nombreGrupo);
    if (imagen) {
      if (imagen.indexOf('@') > 0) {
        img = imagen.substring(0, imagen.length - 1);
        // console.log('imagen =',img);
        return './assets/images/full_' + nombreGrupo + '/' + img;
      } else {
        return './assets/images/full_circle_cari_ia/' + imagen+'.png';
      }
    }
    return './assets/images/no-image.jpg';
  }
}
