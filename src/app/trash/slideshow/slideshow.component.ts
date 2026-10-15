import {
  AfterViewInit,
  Component,
  ElementRef,
  Input,
  OnChanges,
  OnDestroy,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import type Swiper from 'swiper';

import { card } from '../../interfaces/card-response';
import { FaIconLibrary } from '@fortawesome/angular-fontawesome';
import { fas } from '@fortawesome/free-solid-svg-icons';

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.css'],
  standalone: false,
})
export class SlideshowComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() cartones: card[] = [];

  @ViewChild('swiperContainer') swiperContainer!: ElementRef<HTMLElement>;

  public mySwiper?: Swiper;
  public color: string = 'black';

  constructor(library: FaIconLibrary) {
    library.addIconPacks(fas);
  }

  async ngAfterViewInit(): Promise<void> {
    await this.initSwiper();
  }

  // Si los datos llegan después (por ejemplo, desde un servicio HTTP),
  // actualizamos Swiper cuando cambie el input.
  ngOnChanges(changes: SimpleChanges): void {
    if (changes['cartones'] && !changes['cartones'].firstChange) {
      // Esperamos a que Angular pinte los nuevos slides
      setTimeout(() => this.mySwiper?.update());
    }
  }

  private async initSwiper(): Promise<void> {
    const { default: SwiperConstructor } = await import('swiper');
    this.mySwiper = new SwiperConstructor(this.swiperContainer.nativeElement, {
      loop: true,
    });
  }

  onSlideNext(): void {
    this.mySwiper?.slideNext();
  }

  onSlidePrev(): void {
    this.mySwiper?.slidePrev();
  }

  ngOnDestroy(): void {
    this.mySwiper?.destroy(true, true);
  }
}