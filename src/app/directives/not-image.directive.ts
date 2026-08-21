import { Directive, ElementRef, HostListener } from '@angular/core';

@Directive({
  selector: '[appNotImage]',
  standalone: true,
})
export class NotImageDirective {
  constructor(private readonly elementImg: ElementRef<HTMLImageElement>) {}

  @HostListener('error')
  onError(): void {
    this.elementImg.nativeElement.src = './assets/images/no-image.jpg';
  }
}
