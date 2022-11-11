import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CartonesPosterGridComponent } from './cartones-poster-grid.component';

describe('CartonesPosterGridComponent', () => {
  let component: CartonesPosterGridComponent;
  let fixture: ComponentFixture<CartonesPosterGridComponent>;
  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CartonesPosterGridComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CartonesPosterGridComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
