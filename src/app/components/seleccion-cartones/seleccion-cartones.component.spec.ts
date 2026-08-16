import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SeleccionCartonesComponent } from './seleccion-cartones.component';

describe('SeleccionCartonesComponent', () => {
  let component: SeleccionCartonesComponent;
  let fixture: ComponentFixture<SeleccionCartonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SeleccionCartonesComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(SeleccionCartonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
