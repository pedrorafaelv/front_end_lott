import { AfterViewInit, Component, Input, OnInit } from '@angular/core';
import Swiper from 'swiper';
import { card } from '../../interfaces/card-response';
import {  FaIconLibrary  } from "@fortawesome/angular-fontawesome";
import {  faCoffee, faLaptop,faBell} from '@fortawesome/free-solid-svg-icons';
import { fas } from '@fortawesome/free-solid-svg-icons';
// import {IconProp} from '@fortawesome/fontawesome-svg-core';
// import { far } from '@fortawesome/free-regular-svg-icons';
// import { FontawesomeComponent } from '../fontawesome/fontawesome.component';

@Component({
  selector: 'app-slideshow',
  templateUrl: './slideshow.component.html',
  styleUrls: ['./slideshow.component.css']
})
export class SlideshowComponent implements OnInit, AfterViewInit {
 
  @Input() cartones: card[]=[];
  public mySwiper!: Swiper;
  public color: string = 'black';
  // iconos = [faCoffee, faGuitar, faAnchor,faAmbulance, faAppleAlt, faBed, faBell,faBeer, faBible, 
  //   faBicycle, faBirthdayCake, faBook,faBolt, faBone, faBowlingBall, faBoxOpen,  faBug, faBrush, faBuilding, faBusAlt,
  //];
    constructor(library : FaIconLibrary) { 
      library.addIcons(faCoffee, faLaptop, faBell);
      library.addIconPacks(fas);
      //console.log(this.cartones.values);
  }

  ngOnInit(): void {
     //console.log('CARTONES EN SLIDESHOWCOMPONETS', this.cartones);
  }
  
  ngAfterViewInit(): void {
   this.mySwiper = new Swiper('.swiper', {
      loop: true,
    });
     this.mySwiper.slideNext();
  }

   onSlideNext(){
     this.mySwiper.slideNext();
      console.log('onSlideNext');
   }

   onSlidePrev(){
    this.mySwiper.slidePrev();
    console.log('onSlidePrev');

  }
}
