import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotImageDirective } from './not-image.directive';

@NgModule({
  imports: [
    CommonModule,
    NotImageDirective,
  ],
  exports: [
    NotImageDirective
  ]
})
export class DirectivesModule { }