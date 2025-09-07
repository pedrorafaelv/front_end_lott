import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
    selector: '[appNotImage]',
    standalone: false
})
export class NotImageDirective {

  constructor(private  elementImg: ElementRef) {}
  @HostListener('error')
  onError():void{

    this.elementImg.nativeElement.src = './assets/images/no-image.jpg';
  
  }

}
