import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CarruselCartonesComponent } from './carrusel-cartones.component';

describe('CarruselCartonesComponent', () => {
  let component: CarruselCartonesComponent;
  let fixture: ComponentFixture<CarruselCartonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CarruselCartonesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CarruselCartonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
