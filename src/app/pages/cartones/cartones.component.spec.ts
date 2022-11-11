import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartonesComponent } from './cartones.component';

describe('CartonesComponent', () => {
  let component: CartonesComponent;
  let fixture: ComponentFixture<CartonesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartonesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartonesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
