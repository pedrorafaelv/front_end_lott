import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ImagenPipe } from './imagen.pipe';
import { RecordImagePipe } from './record-image.pipe';

@NgModule({
  declarations: [ImagenPipe, RecordImagePipe],
  imports: [
    CommonModule
  ],
  exports:[
    ImagenPipe,
    RecordImagePipe
  ],
})
export class PipesModule { }
