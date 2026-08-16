import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartonSeleccionadoComponent } from './carton-seleccionado.component';

describe('CartonSeleccionadoComponent', () => {
  let component: CartonSeleccionadoComponent;
  let fixture: ComponentFixture<CartonSeleccionadoComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CartonSeleccionadoComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CartonSeleccionadoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
